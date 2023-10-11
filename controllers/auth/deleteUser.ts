import { ipcMain } from "electron";
import { BackendError, BackendRequest, ErrorCodes, toUpperSnake } from "../../utility";
import { malformedRequest } from "../helpers";
import { isAuthorized } from "./utility";
import { User } from "../../models/user";
import { sequelize } from "../../electron/db";

/**
 * Describes the payload for a UserDelete request.
 * 
 * @property {Object} user - Contains the user's ID for deletion.
 * @property {number} user.id - The ID of the user to be deleted.
 */
interface Payload {
	user: {
		id: number;
	};
}

/**
 * Represents a backend request to delete user details.
 *
 * @property {Payload} data - User details for deleting.
 * @property {ResponseData} responseData - Formatted response to be sent back after processing.
 * @method actionType - Converts "UserDelete" string to upper snake case.
 */
export class UserDelete extends BackendRequest<Payload, null> {
	public static actionType = toUpperSnake(this.name);
}

/**
 * IPC Handler for processing and responding to a User Delete request.
 * 
 * @param {Event} _event - Electron's IPC event object.
 * @param {BackendRequest} request - The request object containing user details to be deleted.
 * 
 * @returns {Promise<null>} - Asynchronously returns null after successful deletion.
 * 
 * @throws Will throw an error if any validation or database operation fails.
 */
ipcMain.handle(UserDelete.actionType, async (_event, request) => {
	if (!(request instanceof UserDelete)) {
		const errorResponse = malformedRequest(UserDelete);
		throw (errorResponse.meta.actionType + "_ERROR", errorResponse);
	}

	const { user } = request.data;
	const authToken = request.meta.authToken;

	const transaction = await sequelize.transaction();

	try {
		const currentUser = await User.findByPk(user.id, { transaction });
		if (!currentUser) throw request.respondError(new BackendError("Invalid user", ErrorCodes.DATA_NOT_FOUND));
		if (!isAuthorized(currentUser, authToken))
			throw request.respondError(new BackendError("Unauthorized", ErrorCodes.UNAUTHORIZED));
		await currentUser.destroy({ transaction });
		await transaction.commit();
		return request.respondSuccess(null, authToken);
	} catch (error) {
		await transaction.rollback();
        if (error instanceof BackendError) throw request.respondError(error);
		throw request.respondError(new BackendError("Request failed", ErrorCodes.INTERNAL_SERVER_ERROR));
	}
});

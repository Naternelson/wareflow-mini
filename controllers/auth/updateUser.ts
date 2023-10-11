// Imports
import { ipcMain } from "electron";
import { BackendError, BackendRequest, ErrorCodes, toUpperSnake } from "../../utility";
import { User } from "../../models/user";
import { sequelize } from "../../electron/db";
import { ValidationError } from "sequelize";
import { USER_INCLUDE, isAuthorized, isEmail } from "./utility";
import { malformedRequest } from "../helpers";
import { Department } from "../../models/department";
import { Organization } from "../../models/organization";

// Request Payload definition
interface Payload {
	user: {
		id: number;
		email?: string;
		password?: string;
		firstName?: string;
		lastName?: string;
		displayName?: string;
		photoURL?: string;
	};
}

// Response Data definition
interface ResponseData {
	user: ReturnType<typeof User.prototype.sanitize>;
	department?: ReturnType<typeof Department.prototype.sanitize>;
	organization?: ReturnType<typeof Organization.prototype.sanitize>;
}

/**
 * Represents a backend request to update user details.
 * 
 * @property {Payload} data - User details for updating.
 * @property {ResponseData} responseData - Formatted response to be sent back after processing.
 * @method actionType - Converts "UserUpdate" string to upper snake case.
 */
export class UserUpdate extends BackendRequest<Payload, ResponseData> {
	public static actionType = toUpperSnake("UserUpdate");
}

/**
 * IPC Handler for processing and responding to a User Update request.
 * 
 * @param {Event} _event - Electron's IPC event object.
 * @param {BackendRequest} request - The request object containing user details to be updated.
 * 
 * @returns {Promise<ResponseData>} - Asynchronously returns the response data after processing.
 * 
 * @throws Will throw an error if any validation or database operation fails.
 */
ipcMain.handle(UserUpdate.actionType, async (_event, request) => {
	// Validate the request instance
	if (!(request instanceof UserUpdate)) {
		const errorResponse = malformedRequest(UserUpdate);
		throw (errorResponse.meta.actionType + "_ERROR", errorResponse);
	}

	const { user } = request.data;
	const authToken = request.meta.authToken;
	
    const transaction = await sequelize.transaction()

	try {

		// Fetch and validate the user
		const currentUser = await User.findByPk(user.id, { transaction, include: USER_INCLUDE });
		if (!currentUser) throw request.respondError(new BackendError("Invalid user", ErrorCodes.DATA_NOT_FOUND));
		if (!isAuthorized(currentUser, authToken))
			throw request.respondError(new BackendError("Unauthorized", ErrorCodes.UNAUTHORIZED));

		// Verify new password if being updated
		if (user.password && !currentUser.validatePasswordFormat(user.password)) {
			throw request.respondError(new BackendError("Invalid password", ErrorCodes.USER_INVALID_PASSWORD));
		}

		// Check for unique email if being updated
		if (user.email && user.email !== currentUser.email) {
			if (!isEmail(user.email))
				throw request.respondError(new BackendError("Invalid email", ErrorCodes.USER_INVALID_EMAIL));

			const existingUser= await User.findOne({
				where: { email: user.email },
				transaction,
				attributes: ["id", "email"],
			});
			if (existingUser)
				throw request.respondError(new BackendError("Email already in use", ErrorCodes.USER_INVALID_EMAIL));
		}

		// Update user information
		await currentUser.update(user, { transaction });
        await currentUser.reload({ transaction });
		await transaction.commit();

		// Return success response
		return request.respondSuccess(
			{
				user: currentUser.sanitize(),
				organization: currentUser.organization?.sanitize(),
				department: currentUser.department?.sanitize(),
			},
			request.meta.authToken
		);
	} catch (error) {
		await transaction.rollback();
		if (error instanceof BackendError) throw request.respondError(error);
		if (error instanceof ValidationError)
			throw request.respondError(new BackendError(error.message, ErrorCodes.REQUEST_INVALID));
		throw request.respondError(new BackendError("Invalid user", ErrorCodes.DATA_NOT_FOUND));
	}
});


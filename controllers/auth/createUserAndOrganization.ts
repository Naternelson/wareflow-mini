import { ipcMain } from "electron";
import { BackendError, BackendRequest, ErrorCodes, toUpperSnake } from "../../utility";
import { malformedRequest } from "../helpers";
import { AccessScope, User } from "../../models/user";
import { Department } from "../../models/department";
import { Organization } from "../../models/organization";
import { sequelize } from "../../electron/db";
import { ValidationError } from "sequelize";

/**
 * Represents a request to sign in a user.
 */
interface Payload {
	user: {
		email: string;
		password: string;
		firstName?: string;
		lastName?: string;
		displayName?: string;
		photoURL?: string;
	};
	organization: {
		name: string;
		description: string;
		address: Partial<{
			street: string;
			street2: string;
			city: string;
			state: string;
			zip: string;
			country: string;
		}>;
	};
	department?: {
		name: string;
		description: string;
	};
}

interface ResponseData {
	user: ReturnType<typeof User.prototype.sanitize>;
	department?: ReturnType<typeof Department.prototype.sanitize>;
	organization?: ReturnType<typeof Organization.prototype.sanitize>;
}

export class UserCreationWithOrg extends BackendRequest<Payload, ResponseData> {
	public static actionType = toUpperSnake("UserCreationWithOrg");
}

ipcMain.handle(UserCreationWithOrg.actionType, async (_event, request) => {
	if (!(request instanceof UserCreationWithOrg)) {
		const errorResponse = malformedRequest(UserCreationWithOrg);
		throw (errorResponse.meta.actionType + "_ERROR", errorResponse);
	}
	const { organization, department, user } = request.data;
    const transaction = await sequelize.transaction();
	try {
		const org = await Organization.create(organization, { transaction });
		if (!org) throw request.respondError(new BackendError("Invalid organization", ErrorCodes.DATA_NOT_FOUND));
		const u = await org.createUser({ ...user, accessScope: AccessScope.ADMIN }, { transaction });
		if (!u) throw request.respondError(new BackendError("Invalid user", ErrorCodes.DATA_NOT_FOUND));
		if (department) {
			const d = await org.createDepartment(department, { transaction });
			if (!d) throw request.respondError(new BackendError("Invalid department", ErrorCodes.DATA_NOT_FOUND));
		}
		await transaction.commit();
		const response = {
			user: u.sanitize(),
			department: u.department?.sanitize(),
			organization: u.organization?.sanitize(),
		};
		const authToken = u.generateAuthToken();
		return request.respondSuccess(response, authToken);
	} catch (error) {
        await transaction.rollback();
		if (error instanceof BackendError) throw request.respondError(error);
		if (error instanceof ValidationError)
			throw request.respondError(new BackendError(error.message, ErrorCodes.REQUEST_INVALID));
		throw request.respondError(new BackendError("Unknown error", ErrorCodes.UNKNOWN_ERROR));
	}
});

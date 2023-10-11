import { ipcMain } from "electron";
import { BackendError, BackendRequest, ErrorCodes, toUpperSnake } from "../../utility";
import { malformedRequest } from "../helpers";
import { USER_INCLUDE, isEmail } from "./utility";
import { User } from "../../models/user";
import { Department } from "../../models/department";
import { Organization } from "../../models/organization";


/**
 * Represents a request to sign in a user.
 */
interface Payload {
	email: string;
	password: string;
}

interface ResponseData {
	user: ReturnType<typeof User.prototype.sanitize>;
	department?: ReturnType<typeof Department.prototype.sanitize>;
	organization?: ReturnType<typeof Organization.prototype.sanitize>;
}

export class UserSignIn extends BackendRequest<Payload, ResponseData> {
	public static actionType = toUpperSnake("UserSignIn");
}

export const signInHandler: Parameters<typeof ipcMain.handle>[1] = async (_event, request) => {
	if (!(request instanceof UserSignIn)) {
		const errorResponse = malformedRequest(UserSignIn);
		throw (errorResponse.meta.actionType + "_ERROR", errorResponse);
	}
	const { email, password } = request.data;
	if (!isEmail(email)) throw request.respondError(new BackendError("Invalid email", ErrorCodes.USER_INVALID_EMAIL));
	if (!password) throw request.respondError(new BackendError("Invalid password", ErrorCodes.USER_INVALID_PASSWORD));
	const user = await User.findOne({ where: { email }, include: USER_INCLUDE });
	if (!user) throw request.respondError(new BackendError("User not found", ErrorCodes.USER_NOT_FOUND));
	const valid = await user.validatePassword(password);
	if (!valid) throw request.respondError(new BackendError("Invalid password", ErrorCodes.USER_INVALID_PASSWORD));
	await user.updateLastLogin();
	const response = {
		user: user.sanitize(),
		department: user.department?.sanitize(),
		organization: user.organization?.sanitize(),
	};
	const authToken = user.generateAuthToken();
	return request.respondSuccess(response, authToken);
}

ipcMain.handle(UserSignIn.actionType, signInHandler);

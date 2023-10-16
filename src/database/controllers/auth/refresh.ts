import { IpcMainInvokeEvent, ipcMain } from "electron";
import { AuthHandler, UserRefreshRequest, UserSigninResponse } from "../../../common/auth";
import { isRequest } from "../utility/checkRequest";
import { AppResponse } from "../../../common/response";
import { ErrorCodes } from "../../../utility";
import { User } from "../../models/user";

const listener = async (_event: IpcMainInvokeEvent, request: any): Promise<AppResponse<UserSigninResponse>> => {
	try {
		const validRequest = isRequest<UserRefreshRequest>(request);
		if (!validRequest) throw AppResponse.createError(ErrorCodes.REQUEST_INVALID, "Invalid request", null);
		const { token } = request.data;
		if (!token) throw AppResponse.createError(ErrorCodes.REQUEST_INVALID, "Missing token data", null);
		const user = await User.findByToken(token);

		if (!user) throw AppResponse.createError(ErrorCodes.USER_NOT_FOUND, "User not found", { tokenProvided: token });
		const { organization } = user;
		if (!organization) throw AppResponse.createError(ErrorCodes.DATA_NOT_FOUND, "Organization not found", null);
		const newToken = user.signToken();

		const response: UserSigninResponse = {
			token: newToken,
			user: user.sanitize(),
			organization: organization.sanitize(),
		};
		return new AppResponse(response);
	} catch (error) {
		if (error instanceof AppResponse) throw error;
		throw AppResponse.createError(ErrorCodes.INTERNAL_SERVER_ERROR, "Request failed", null);
	}
};

ipcMain.handle(AuthHandler.USER_REFRESH, listener);

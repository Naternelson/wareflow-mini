import { IpcMainInvokeEvent, ipcMain } from "electron";
import { AuthHandler, UserSigninRequest, UserSigninResponse } from "../../../common/auth";
import { isRequest } from "../utility/checkRequest";
import { AppResponse } from "../../../common/response";
import { ErrorCodes } from "../../../utility";
import { User } from "../../models/user";

const listener = async (_event: IpcMainInvokeEvent, request: any): Promise<AppResponse<UserSigninResponse>> => {
    try {
        const validRequest = isRequest<UserSigninRequest>(request);
        if(!validRequest) throw AppResponse.createError(ErrorCodes.REQUEST_INVALID, "Invalid request", null);
        const { email, password } = request.data;
        if(!email || !password) throw AppResponse.createError(ErrorCodes.REQUEST_INVALID, "Missing request data", null);
        const user = await User.findOne({ where: { email }, include: { all: true }});
        if(!user) throw AppResponse.createError(ErrorCodes.USER_NOT_FOUND, "User not found", {email});
        const validPassword = await user.comparePassword(password);
        if(!validPassword) throw AppResponse.createError(ErrorCodes.USER_INVALID_PASSWORD, "Invalid password", null);
        const {organization} = user;
        if(!organization) throw AppResponse.createError(ErrorCodes.DATA_NOT_FOUND, "Organization not found", {email, organizationId: user.organizationId});
        const token = user.signToken();  
        
        const response: UserSigninResponse = {
            token,
            user: user.sanitize(),
            organization: organization.sanitize()
        }    
        return new AppResponse(response);
    } catch (error) {
        if(error instanceof AppResponse) throw error;
        throw AppResponse.createError(ErrorCodes.INTERNAL_SERVER_ERROR, "Request failed", null);
    }

}

ipcMain.handle(AuthHandler.USER_SIGNIN, listener)


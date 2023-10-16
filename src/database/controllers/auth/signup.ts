import { ipcMain } from "electron";
import { AuthHandler, UserPermission, UserSigninResponse, UserSignupWithOrganizationRequest } from "../../../common/auth";
import { AppResponse } from "../../../common/response";
import { ErrorCodes } from "../../../utility";
import { sequelize } from "../../db";
import { Organization } from "../../models/organization";
import { isRequest } from "../utility/checkRequest";

const listener = async (_event: any, request: any): Promise<AppResponse<UserSigninResponse>> => {
	const validRequest = isRequest<UserSignupWithOrganizationRequest>(request);
	if (!validRequest) throw AppResponse.createError(ErrorCodes.REQUEST_INVALID, "Invalid request", null);
	if (requiredFields.find((field) => !request.data[field]))
		throw AppResponse.createError(ErrorCodes.REQUEST_INVALID, "Missing required fields", null);
	const transaction = await sequelize.transaction();

	try {
		const { firstName, lastName, email, password, organizationName } = request.data;
        if(!email) throw AppResponse.createError(ErrorCodes.REQUEST_INVALID, "Email must be provided", null);
        // test email
        if(new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email)) throw AppResponse.createError(ErrorCodes.REQUEST_INVALID, "Email must be valid", null);
        if(!password) throw AppResponse.createError(ErrorCodes.REQUEST_INVALID, "Password must be provided", null);
        if(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).test(password)) throw AppResponse.createError(ErrorCodes.REQUEST_INVALID, "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number", null);
        
        if(!organizationName) throw AppResponse.createError(ErrorCodes.REQUEST_INVALID, "Organization name must be at least 3 characters", null);
		const address = {
			street: request.data.street,
			street2: request.data.street2,
			city: request.data.city,
			state: request.data.state,
			zip: request.data.zip,
		};
		const organization = await Organization.create({name: organizationName});
        await organization.createAddress(address, { transaction });
        const user = await organization.createUser({ firstName:  firstName || "", lastName: lastName || "", email, password, permission: UserPermission.ADMIN }, { transaction });
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

ipcMain.handle(AuthHandler.USER_SIGNUP_WITH_ORGANIZATION, listener);


const requiredFields: (keyof UserSignupWithOrganizationRequest)[] = [
	"firstName",
	"lastName",
	"email",
	"password",
	"organizationName",
];

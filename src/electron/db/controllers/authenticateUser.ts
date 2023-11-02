import { ApiRequest, UnauthorizedError, UserPermission } from "../../../common";
import { Organization, User } from "../models";

export const authenticateUser = (request: ApiRequest, permission?: UserPermission, organizationId?: number) => {
	const { meta } = request;
	if (!meta) throw new Error("Request meta is missing");
	const { user, organization } = meta;
	if (!user) throw new UnauthorizedError("Request user is missing");
    if(!organization) throw new UnauthorizedError("Request organization is missing");
    if(!(organization instanceof Organization)) throw new UnauthorizedError("Request organization is not an instance of Organization");
	if (!(user instanceof User)) throw new UnauthorizedError("Request user is not an instance of User");
	const permissable: UserPermission[] = [];
	switch (permission) {
		case UserPermission.SuperAdmin:
			permissable.push(UserPermission.SuperAdmin);
			break;
		case UserPermission.Admin:
			permissable.push(UserPermission.SuperAdmin, UserPermission.Admin);
			break;
		case UserPermission.User:
			permissable.push(UserPermission.SuperAdmin, UserPermission.Admin, UserPermission.User);
			break;
		default:
			permissable.push(
				UserPermission.SuperAdmin,
				UserPermission.Admin,
				UserPermission.User,
				UserPermission.Guest
			);
			break;
	}
    if(user.permission === UserPermission.SuperAdmin) return;
    if(organizationId && organizationId !== organization.id) throw new UnauthorizedError("User does not have permission to perform this action");
	if (!permissable.includes(user.permission))
		throw new UnauthorizedError("User does not have permission to perform this action");
};



import { ApiRequest, AuthResponse, UserPermission } from "../../common";
import { signinUser } from "./controllers/auth/signin";
import { Organization, User } from "./models";
import { ipcRenderer } from "electron";

export const SeedDb = async () => {
	const organization = await Organization.create({
		name: "Super Admin Organization",
	});

    try{
	const user = await User.create(
		{
			firstName: "Nathan",
			lastName: "Nelson",
			email: "email@email.com",
			password: "Password1234!",
			permission: UserPermission.SuperAdmin,
			organizationId: organization.id,
		},
		{}
	);
	const targetUser = await User.findByPk(user.id, { include: [{ model: Organization, as: "organization" }] });
	const request: ApiRequest<{ email: string; password: string; organizationId: number }, AuthResponse> = {
		meta: {
			user: targetUser,
			organization: organization,
		},
		resource: "auth/signin",
		body: {
			email: "email@email.com",
			password: "Password1234!",
			organizationId: organization.id,
		},
		_shape: "ApiRequest",
	};
    try {
	    const result = await signinUser(request)
        console.log({request, result})
    } catch(error) {
        console.log("Error signing in", error)
    }
    } catch {
        console.log("FAILED TO CREATE USER")
    }

};

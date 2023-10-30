import {
	RequestHandler,
	ApiError,
	BadRequestError,
	ForbiddenError,
	InternalServerError,
	UnauthorizedError,
    UserPermission,
    ApiRequest
} from "../../../../common";
import { logger } from "../../../logger";
import { Organization, User } from "../../models";



export const updateUser: RequestHandler = async (request: ApiRequest): Promise<{message: string}> => {
	const { meta, body } = request;
	const { user, organization } = meta || {};
	const { id } = body || {};
	try {
		validateRequest(user, organization, id);
		const targetUser = await getTargetUser(user, organization, id as number);
		if (!targetUser || targetUser.isSoftDeleted()) throw new BadRequestError("Invalid id", { id });
		await updateFields(targetUser, body);
		await targetUser.save();
		return { message: "User updated successfully" };
	} catch (error) {
		logger.error("Error updating user", error);
		if (error instanceof ApiError) throw error;
		throw new InternalServerError("Error updating user");
	}
};

const validateRequest = (user: User, organization: Organization, id?: number) => {
	if (!user || !(user instanceof User) || !organization || !(organization instanceof Organization)) {
		throw new UnauthorizedError("Unauthorized token");
	}

	if (typeof id !== "number" || !id) {
		throw new BadRequestError("Invalid or missing id", { id });
	}

	if (user.id !== id || (user.permission !== UserPermission.Admin && user.permission !== UserPermission.SuperAdmin)) {
		throw new ForbiddenError("User does not have permission to update this user", {
			id: user.id,
			permission: user.permission,
		});
	}
};

const getTargetUser = async (user: User, organization: Organization, id: number) => {
	let targetUser: User | null = null;
	switch (user.permission) {
		case UserPermission.SuperAdmin:
			targetUser = await User.findByPk(id, { include: ["organization"] });
			break;
		case UserPermission.Admin:
			targetUser = await organization.findUserByPk(id);
			break;
		default:
			targetUser = user;
			break;
	}
	return targetUser;
};

const updateFields = async (user: User, body: any) => {
	const { firstName, lastName, email, password } = body || {};
	if (typeof firstName === "string") user.firstName = firstName;
	if (typeof lastName === "string") user.lastName = lastName;
	if (typeof email === "string") {
		if (!User.emailPattern.test(email)) throw new BadRequestError("Invalid email", { email });
		const existingUser = await User.findOne({ where: { email, organizationId: user.organizationId } });
		if (existingUser) throw new BadRequestError("Email already in use", { email });
	}
	if (typeof password === "string") {
		if (!User.passwordPattern.test(password))
			throw new BadRequestError(
				"Invalid password. Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter and one number"
			);
		user.password = password;
	}
};

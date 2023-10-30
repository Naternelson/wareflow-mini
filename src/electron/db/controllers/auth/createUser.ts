import {
	ApiError,
	ApiRequest,
	AuthResponse,
	BadRequestError,
	BasicUser,
	ForbiddenError,
	InternalServerError,
	UnauthorizedError,
	UserPermission,
	findMissingFields,
} from "../../../../common";
import { logger } from "../../../logger";
import { Organization, User } from "../../models";

export const createUser = async (request: ApiRequest) => {
	try {
		const { meta, body } = request;
		const { user, organization } = meta || {};
		// Validate if the request is authorized and valid
		validateRequest(user, organization, body?.organizationId || organization.id);

		// Validate fields in the request body and get the target organization
		const { organization: targetOrganization, ...fields } = await validateFields({
			...body,
			organizationId: body?.organizationId ? body.organizationId : organization?.id,
		});

		// Create new user
		const newUser = await User.create(fields);
		const token = newUser.signToken();
		newUser.logLogin("success");
		logger.trace("User created", newUser.sanitize());
		return { data: { token, user: newUser.sanitize(), organization: targetOrganization.sanitize() } };
	} catch (error) {
		logger.error("Error creating user", error);
		if (error instanceof ApiError) throw error;

		// Throw internal server error for unexpected errors
		throw new InternalServerError("Error creating user");
	}
};

const validateRequest = (user: User, organization: Organization, targetOrgId: number) => {
	// Function to validate the incoming request
	if (!user || !(user instanceof User) || !organization || !(organization instanceof Organization)) {
		throw new UnauthorizedError("Unauthorized token");
	}
	// Check if the user has admin or superadmin permissions
	if (user.permission !== UserPermission.Admin && user.permission !== UserPermission.SuperAdmin) {
		throw new ForbiddenError("User does not have permission to create this user", {
			id: user.id,
			permission: user.permission,
		});
	}
	// Check if a non-superadmin is trying to add a user to a different organization
	if (targetOrgId !== organization.id && user.permission !== UserPermission.SuperAdmin) {
		throw new ForbiddenError("User does not have permission to create this user", {
			id: user.id,
			permission: user.permission,
		});
	}
};

// Function to validate the fields in the request body
const validateFields = async (body: Partial<BasicUser> & { password?: string }) => {
	const { firstName, lastName, email, password, organizationId, permission } = body;

	// Check for any missing required fields
	const missingFields = findMissingFields({ firstName, lastName, email, password, permission, organizationId });

	// Perform individual field validations
	// (Type, format, existence in database, etc.)
	if (missingFields.length) throw new BadRequestError("Missing required fields", { missingFields });
	if (typeof firstName !== "string") throw new BadRequestError("Invalid firstName", { firstName });
	if (typeof lastName !== "string") throw new BadRequestError("Invalid lastName", { lastName });
	if (typeof organizationId !== "number") throw new BadRequestError("Invalid organizationId", { organizationId });
	if (typeof email !== "string") throw new BadRequestError("Invalid email", { email });
	if (!User.emailPattern.test(email)) throw new BadRequestError("Invalid email", { email });
	if (await User.emailExists(email, organizationId)) throw new BadRequestError("Email already exists", { email });
	if (typeof password !== "string") throw new BadRequestError("Invalid password", { password });
	if (!User.passwordPattern.test(password)) throw new BadRequestError("Invalid password", { password });
	if (typeof permission !== "string") throw new BadRequestError("Invalid permission", { permission });
	if (permission === UserPermission.SuperAdmin) throw new BadRequestError("Invalid permission", { permission });
	if (!User.userPermissions.find((p) => p === permission))
		throw new BadRequestError("Invalid permission", { permission });

	// Ensure the organization this user is being added to exists
	const organization = await Organization.findByPk(organizationId);
	if (!organization) throw new BadRequestError("Invalid organizationId", { organizationId });
	if (organization.isSoftDeleted()) throw new BadRequestError("Invalid organizationId", { organizationId });

	// If all validations pass, return the sanitized fields
	return { firstName, lastName, email, password, organizationId, permission, organization };
};

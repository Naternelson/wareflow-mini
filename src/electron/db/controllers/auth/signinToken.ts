
import { logger } from "../../../logger";
import { Organization, User } from "../../models";
import { ApiError, InternalServerError, UnauthorizedError, AuthResponse, ApiRequest } from "../../../../common";

export const signinToken =  async (request:ApiRequest<{}, AuthResponse>) => {
	const { meta } = request;
	const { user, organization } = meta || {};
	try {
		if (!user || !organization) throw new UnauthorizedError("Unauthorized token");
		if (!(user instanceof User)) throw new InternalServerError("Invalid user");
		if (!(organization instanceof Organization)) throw new InternalServerError("Invalid organization");
		user.logLogin("success");
		logger.trace("User signed in with token", user.sanitize());
		const response = {
			data: { user: user.sanitize(), organization: organization.sanitize(), token: user.signToken() },
		};

		return response;
	} catch (error) {
		logger.error("Error signing in with token", error);
		user?.logLogin("failure");
		if (error instanceof ApiError) throw error;
		throw new InternalServerError("Error signing in with token");
	}
};

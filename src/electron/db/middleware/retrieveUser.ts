import { ApiRequest } from "../../../common/api_request";
import { Organization } from "../models/organization";
import { User } from "../models/user";

export const userFromTokenMiddleware = async (request: ApiRequest): Promise<ApiRequest> => {
	// Extract authorization header
	const { headers } = request;
	const { Authorization } = headers || {};

	// Validate authorization type
	if (typeof Authorization !== "string") return request;
	const [type, token] = Authorization.split(" ");
	if (type !== "Bearer") return request;
	if (typeof token !== "string") return request;

	// Validate and find the user
	const user = await User.findByToken(token, {include: {model: Organization, as: "organization"}});
	if (!user) return request;

	// Attach user and organization to request meta
	const meta = request.meta || {};
	meta.user = user;
	meta.organization = user.organization;
	request.meta = meta;

	return request;
};

import {
	findMissingFields,
	ApiError,
	BadRequestError,
	InternalServerError,
	NotFoundError,
	RequestHandler,
	AuthResponse,
} from "../../../../common";
import { ApiRequest } from "../../../../common/api_request";
import { logger } from "../../../logger";
import { User } from "../../models/user";

const MissingUserMessage = "No user or organization was found"

export const signinUser: RequestHandler = async (request: ApiRequest<{email: string, password: string, organizationId: number}, AuthResponse>) => {
    const {email, password, organizationId} = request.body || {};
    // Check for required fields
    const missingFields = findMissingFields({email, password, organizationId})
    if(missingFields.length) throw new BadRequestError("Missing required fields", {missingFields});
    // Check for valid fields
    if(typeof email !== "string") throw new BadRequestError("Invalid email", {email});
    if(typeof password !== "string") throw new BadRequestError("Invalid password", {password});
    if(typeof organizationId !== "number") throw new BadRequestError("Invalid organizationId", {organizationId});
    // Fetch user and organization
    const user = await User.findOne({where: {email, organizationId}, include: ["organization"]});
    // Check for user and organization
    if (!user) throw new NotFoundError(MissingUserMessage, { email, organizationId });
    if(!user?.organization) throw new NotFoundError(MissingUserMessage, {organizationId});
    if (user.isSoftDeleted()) throw new NotFoundError(MissingUserMessage, { email, organizationId });
    try {
        // Check password
        if(!await user.comparePassword(password)) throw new BadRequestError("Invalid password", {email});
        
        // Log login and return token, user and organziation
        user.logLogin("success");
        logger.trace("User signed in", user.sanitize());
        logger.trace("Organization signed in", user.organization.sanitize());
        logger.info("User signed in", user.id)
        const token = user.signToken();
        return {data : {token, user: user.sanitize(), organization: user.organization.sanitize()}};
    } catch (error) {
        user.logLogin("failure");
        logger.error("Error signing in", error)
        logger.info("User failed to sign in", user?.id)
        if(error instanceof ApiError) throw error;
        throw new InternalServerError("Error signing in")
    }
}

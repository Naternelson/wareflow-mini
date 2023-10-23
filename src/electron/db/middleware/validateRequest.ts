import { BadRequestError } from "../../../common/api_error";
import { ApiRequest } from "../../../common/api_request"

const isApiRequest = (request: any): request is ApiRequest<any, any> => {
    return request._shape === "ApiRequest";
}

export const validateRequest = (request: any): ApiRequest<any, any> => {
    if(!isApiRequest(request)) throw new BadRequestError("Invalid request", {request});
    return request;
}

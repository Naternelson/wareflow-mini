import { ApiRequest } from "../../common/api_request";

const handlers = new Map<string, (request: ApiRequest<any, any>) => Promise<any>>();


// Set handlers here

export default handlers;
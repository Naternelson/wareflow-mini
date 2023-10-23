import { ipcMain } from "electron";
import { validateRequest } from "./middleware/validateRequest";
import { ApiRequest } from "../../common/api_request";
import { NotFoundError } from "../../common/api_error";
import { userFromTokenMiddleware } from "./middleware/retrieveUser";
import { appControllers } from "./controllers";

type MiddlewareFn = (request: ApiRequest<any, any> )=> Promise<ApiRequest<any, any>>;
const middleware: MiddlewareFn[] = [userFromTokenMiddleware];



ipcMain.handle("api-call", async (_event, request) => {
    let r = validateRequest(request);
    for(let fn of middleware){
        r = await fn(r);
    }
    const handler = appControllers.get(r.resource);
    if(!handler) throw new NotFoundError("No handler found for resource", {resource: r.resource});
    return await handler(r);

})
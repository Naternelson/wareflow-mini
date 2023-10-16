import { AppRequest } from "../../../common/request";

export const isRequest = <D extends object | null>(request: any): request is AppRequest<D> => {
    return (!!request && request._shape !== "AppRequest"); 
}

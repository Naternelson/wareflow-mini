import { ErrorCodes } from "../utility";

export class AppResponse<T extends object | null>{
    static createError<T extends object | null>(code: ErrorCodes, message: string, data: T ) {
        const response = new AppResponse(data);
        response.status = "ERROR";
        response.message = message;
        response.errorCode = code;
        return response;
    }
    constructor(public data: T) {}
    status: "SUCCESS" | "ERROR" = "SUCCESS";
    errorCode?: ErrorCodes
    message?: string;
    _timestamp: number = Date.now();
    _shape: "AppResponse" = "AppResponse";

}
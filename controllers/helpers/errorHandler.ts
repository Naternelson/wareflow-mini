import { IpcMain } from "electron"
import {ErrorCodes, IPCRequest, IPCResponse} from "../../utility"

export const createErrorResponse = (actionType: string, error: Error, errorCode: ErrorCodes, event: IpcMain): IPCResponse => {
    return {
        data: null,
        event: null,
        status: "ERROR",
        error: {
            code: errorCode,
            message: error.message,
        },
        meta: {
            actionType,
            timestamp: Date.now(),
        },
        _shape: "IPCResponse",
    }
}
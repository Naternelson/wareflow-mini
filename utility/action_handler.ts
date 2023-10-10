import { ErrorCodes } from "./error_codes";
import {v4 as uuid} from "uuid";
import { toUpperSnake } from "./string_handlers";
import { IpcMain } from "electron";

export class BackendError extends Error {
	constructor(message: string, public code: ErrorCodes) {
		super(message);
	}
	_shape: "BackendError" = "BackendError";
}


export class BackendResponse<Data = unknown> {
	constructor(
		public data: Data,
		public meta: { actionType: string; timestamp: number; requestId: string },
		public status: "SUCCESS" | "ERROR",
		public error?: { code: ErrorCodes; message: string }
	) {}
	_shape: "BackendResponse" = "BackendResponse";
}
export class BackendRequest<Payload = unknown, ResponseData = unknown> {
	constructor(public data: Payload, actionType: string, authToken?: string) {
		this.meta = {
			actionType: toUpperSnake(actionType),
			timestamp: Date.now(),
			authToken,
			requestId: uuid(),
		};
	}

	public meta: {
		actionType: string;
		timestamp: number;
		authToken?: string;
		requestId: string;
	};
	get successType(): string {
		return `${this.uniqueResponseId}_SUCCESS`;
	}
	get failureType(): string {
		return `${this.uniqueResponseId}_ERROR`;
	}
	get uniqueResponseId(): string {
		return `${this.meta.actionType}_${this.meta.requestId}`;
	}

	_shape: "BackendRequest" = "BackendRequest";

	send(ipcRenderer: Electron.IpcRenderer) {
		ipcRenderer.send(this.meta.actionType, this);
	}

	listen(
		ipcRenderer: Electron.IpcRenderer,
		onSuccess: (response: BackendResponse<ResponseData>) => void,
		onFailure: (response: BackendResponse<null>) => void,
		timeoutTime: number = 10000
	) {
		let timeout: NodeJS.Timeout;
		ipcRenderer.on(this.successType, (_event, response: BackendResponse<ResponseData>) => {
			clearTimeout(timeout);
			onSuccess(response);
			ipcRenderer.removeAllListeners(this.failureType);
		});
		ipcRenderer.on(this.failureType, (_event, response: BackendResponse<null>) => {
			clearTimeout(timeout);
			onFailure(response);
			ipcRenderer.removeAllListeners(this.successType);
		});

		timeout = setTimeout(() => {
			onFailure(
				new BackendResponse(null, this.meta, "ERROR", {
					code: ErrorCodes.TIMEOUT,
					message: "Request timed out",
				})
			);
		}, timeoutTime);
		return () => {
			ipcRenderer.removeAllListeners(this.successType);
			ipcRenderer.removeAllListeners(this.failureType);
		};
	}

	respondSuccess(data: ResponseData, ipcMain:IpcMain):void {
		const response =  new BackendResponse(data, {
			actionType: this.meta.actionType,
			timestamp: Date.now(),
			requestId: this.meta.requestId,
		}, "SUCCESS");
		ipcMain.emit(this.successType, response);
	}
	respondError(error: BackendError, ipcMain:IpcMain): void{
		const response = new BackendResponse(null, {
			actionType: this.meta.actionType,
			timestamp: Date.now(),
			requestId: this.meta.requestId,
		}, "ERROR", {
			code: error.code,
			message: error.message,
		});
		ipcMain.emit(this.failureType, response);
	}
	respond(ipcMain: IpcMain, data: ResponseData | BackendError): void {
		if(data instanceof BackendError) {
			this.respondError(data, ipcMain);
		} else {
			this.respondSuccess(data, ipcMain);
		}
	}
}

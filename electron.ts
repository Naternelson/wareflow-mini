import { v4 as uuid } from "uuid";
import { IpcMainEvent } from "electron";
import { ErrorCodes, toUpperSnake } from "./utility";

/**
 * Represents errors originating from the backend.
 */
export class BackendError extends Error {
	_shape: "BackendError" = "BackendError";

	constructor(message: string, public code: ErrorCodes) {
		super(message);
	}
}

/**
 * Represents a standard response format that will be returned to the renderer process.
 */
export class BackendResponse<Data = unknown> {
	_shape: "BackendResponse" = "BackendResponse";

	constructor(
		public data: Data,
		public meta: { actionType: string; timestamp: number; requestId: string },
		public status: "SUCCESS" | "ERROR",
		public error?: { code: ErrorCodes; message: string }
	) {}
}

/**
 * Represents IPC requests made from the renderer to the main process.
 */
export class BackendRequest<Payload = unknown, ResponseData = unknown> {
	public static actionType: string = toUpperSnake(this.name);
	public meta: {
		actionType: string;
		timestamp: number;
		authToken?: string;
		requestId: string;
	};

	_shape: "BackendRequest" = "BackendRequest";

	constructor(public data: Payload, authToken?: string) {
		this.meta = {
			actionType: this.constructor["actionType"],
			timestamp: Date.now(),
			authToken,
			requestId: uuid(),
		};
	}

	/** Generates a unique string for successful responses. */
	get successType(): string {
		return `${this.uniqueResponseId}_SUCCESS`;
	}

	/** Generates a unique string for error responses. */
	get failureType(): string {
		return `${this.uniqueResponseId}_ERROR`;
	}

	/** Generates a unique identifier combining action type and request ID. */
	get uniqueResponseId(): string {
		return `${this.meta.actionType}_${this.meta.requestId}`;
	}
	/** Updates the timestamp */
	updateTimestamp() {
		this.meta.timestamp = Date.now();
	}
	/**
	 * Sends the current request to the main process.
	 * @param ipcRenderer The IPC renderer instance.
	 */
	send(ipcRenderer: Electron.IpcRenderer) {
		this.updateTimestamp();
		ipcRenderer.send(this.meta.actionType, this);
	}

	/**
	 * Listens for a response from the main process for this request.
	 * @param ipcRenderer The IPC renderer instance.
	 * @param onSuccess Callback for successful responses.
	 * @param onFailure Callback for failed responses.
	 * @param timeoutTime Duration after which the request is considered timed out.
	 */
	listen(
		ipcRenderer: Electron.IpcRenderer,
		onSuccess: (response: BackendResponse<ResponseData>) => void,
		onFailure: (response: BackendResponse<null>) => void,
		timeoutTime: number = 10000
	) {
		let timeout: NodeJS.Timeout;
		ipcRenderer.on(this.successType, (_event, response: BackendResponse<ResponseData>) => {
			onSuccess(response);
			cleanup()
		});

		ipcRenderer.on(this.failureType, (_event, response: BackendResponse<null>) => {
			onFailure(response);
			cleanup()
		});

		timeout = setTimeout(() => {
			onFailure(
				new BackendResponse(null, this.meta, "ERROR", {
					code: ErrorCodes.TIMEOUT,
					message: "Request timed out",
				})
			);
			cleanup()
		}, timeoutTime);

		const cleanup = () => {	
			clearTimeout(timeout);
			ipcRenderer.removeAllListeners(this.successType);
			ipcRenderer.removeAllListeners(this.failureType);
		}

		return cleanup
	}

	/**
	 * Responds with a successful result.
	 * @param event The original IPC event from the request.
	 * @param data The data to send back as a response.
	 */
	respondSuccess(event: IpcMainEvent, data: ResponseData): void {
		const response = new BackendResponse(
			data,
			{
				actionType: this.meta.actionType,
				timestamp: Date.now(),
				requestId: this.meta.requestId,
			},
			"SUCCESS"
		);
		event.reply(this.successType, response);
	}

	/**
	 * Responds with an error.
	 * @param event The original IPC event from the request.
	 * @param error The error details to send back.
	 */
	respondError(event: IpcMainEvent, error: BackendError): void {
		const response = new BackendResponse(
			null,
			{
				actionType: this.meta.actionType,
				timestamp: Date.now(),
				requestId: this.meta.requestId,
			},
			"ERROR",
			{
				code: error.code,
				message: error.message,
			}
		);
		event.reply(this.failureType, response);
	}

	/**
	 * Sends a response, either success or error, based on the given data.
	 * @param event The original IPC event from the request.
	 * @param data The data or error to send back as a response.
	 */
	respond(event: IpcMainEvent, data: ResponseData | BackendError): void {
		if (data instanceof BackendError) {
			this.respondError(event, data);
		} else {
			this.respondSuccess(event, data);
		}
	}
}

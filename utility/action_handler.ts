import { ErrorCodes, toUpperSnake } from "../utility";

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
		public meta: { actionType: string; timestamp: number, authToken?: string },
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
	};

	_shape: "BackendRequest" = "BackendRequest";

	constructor(public data: Payload, authToken?: string) {
		this.meta = {
			actionType: this.constructor["actionType"],
			timestamp: Date.now(),
			authToken,
		};
	}

	/** Generates a unique string for successful responses. */
	get successType(): string {
		return `${this.meta.actionType}_SUCCESS`;
	}

	/** Generates a unique string for error responses. */
	get failureType(): string {
		return `${this.meta.actionType}_ERROR`;
	}

	/** Updates the timestamp */
	updateTimestamp() {
		this.meta.timestamp = Date.now();
	}
	/**
	 * Sends the current request to the main process.
	 * @param ipcRenderer The IPC renderer instance.
	 */
	send(ipcRenderer: Electron.IpcRenderer, timeout: number = 10000): Promise<BackendResponse<ResponseData | null>> {
		this.updateTimestamp();

		// Define the timeout as a Promise
		const timeoutPromise = new Promise<BackendResponse<null>>((_, reject) => {
			setTimeout(() => {
				reject(new BackendError("Request timed out", ErrorCodes.REQUEST_TIMEOUT));
			}, timeout);
		});

		// Define the IPC invoke as a Promise
		const responsePromise = ipcRenderer
			.invoke(this.meta.actionType, this)
			.then((res: any): BackendResponse<ResponseData | null> => {
				if (!res || !res._shape || res._shape === "BackendResponse")
					throw new BackendError("Request failed", ErrorCodes.REQUEST_FAILED);
				return res;
			})
			.catch((error: any) => {
				if (!error || !error._shape || error._shape === "BackendError")
					throw new BackendError("Request failed", ErrorCodes.REQUEST_FAILED);
				throw error;
			});
		// Race the two Promises
		return Promise.race([responsePromise, timeoutPromise]);
	}
	/**
	 * Responds with a successful result.
	 * @param event The original IPC event from the request.
	 * @param data The data to send back as a response.
	 */
	respondSuccess(data: ResponseData, authToken?: string): BackendResponse<ResponseData> {
		return new BackendResponse(
			data,
			{
				actionType: this.meta.actionType,
				timestamp: Date.now(),
				authToken,
			},
			"SUCCESS"
		);
	}

	/**
	 * Responds with an error.
	 * @param event The original IPC event from the request.
	 * @param error The error details to send back.
	 */
	respondError(error: BackendError): BackendResponse<null> {
		return new BackendResponse(
			null,
			{
				actionType: this.meta.actionType,
				timestamp: Date.now(),
				authToken: this.meta.authToken,
			},
			"ERROR",
			{
				code: error.code,
				message: error.message,
			}
		);
	}

	/**
	 * Sends a response, either success or error, based on the given data.
	 * @param event The original IPC event from the request.
	 * @param data The data or error to send back as a response.
	 */
	respond(data: ResponseData | BackendError, authToken?: string): BackendResponse<ResponseData | null> {
		if (data instanceof BackendError) {
			return this.respondError(data);
		} else {
			return this.respondSuccess(data, authToken);
		}
	}
}

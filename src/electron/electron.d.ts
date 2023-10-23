declare global {
	interface Window {
		electron: {
			send: (channel: string, data: any) => void;
			on: (channel: string, func: any) => () => void; // Notice the new return type
			invoke: (channel: string, data: any) => Promise<any>;
		};
	}
}

export {}; // Ensure module-like behavior

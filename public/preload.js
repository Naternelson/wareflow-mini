const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
	send: ipcRenderer.send,
	on: (channel, func) => {
		const wrappedFunc = (event, ...args) => func(...args);
		ipcRenderer.on(channel, wrappedFunc);
		// Return a cleanup function
		return () => ipcRenderer.removeListener(channel, wrappedFunc);
	},
	invoke: ipcRenderer.invoke,
});

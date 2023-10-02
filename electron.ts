import { app, BrowserWindow } from "electron";
import path from "path";
import isDev from "electron-is-dev";
import installExtension, { REDUX_DEVTOOLS } from "electron-devtools-installer";
// import setupDB from "./electron/db";
import { Database } from "sqlite3";


let mainWindow: BrowserWindow | null;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: path.join(__dirname, "public", "preload.js"),
		},
	});
	mainWindow.maximize();
	mainWindow.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "public", "index.html")}`);

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
}

// Setup DB
let db: Database | null = null; 

app.on("ready", () => {
    createWindow()
    // db = setupDB(app);
    if(isDev) installExtension(REDUX_DEVTOOLS).then((name) => console.log(`Added Extension: ${name}`)).catch((err) => console.log("An error occurred: ", err));
});

app.on("window-all-closed", () => {
    if(db) {
        db.close(e => console.log(e));
        db = null;
    }
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});

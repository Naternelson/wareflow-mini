import { app, BrowserWindow, Menu, MenuItem } from "electron";
import path from "path";
import isDev from "electron-is-dev";
import installExtension, { REDUX_DEVTOOLS } from "electron-devtools-installer";
import { config } from "dotenv";
import "./src/electron/db/entry";
import { sequelize } from "./src/electron/db/db";
import { clearDB } from "./src/electron/db/dev-actions/clearDB";
import { SeedDb } from "./src/electron/db/dev-actions/seed";
config();

let mainWindow: BrowserWindow | null;
// Add Menu option to File Menu

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
	const FileMenuItems = Menu.getApplicationMenu()?.items[0].submenu;

	FileMenuItems?.insert(
		0,
		new MenuItem({
			label: "Wipe DB",
			click: async () => {
				try {
					clearDB();
				} catch {
					console.log("Failed to clear DB");
				}

				mainWindow?.reload();
			},
		})
	);
	FileMenuItems?.insert(
		0,
		new MenuItem({
			label: "SeedDB",
			click: () => {
				try {
					SeedDb();
				} catch {
					console.log("Failed to seed DB");
				}

				mainWindow?.reload();
			},
		})
	);
	mainWindow.maximize();
	mainWindow.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "public", "index.html")}`);

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
}

// Setup DB

app.on("ready", () => {
	// sequelize.sync();
	createWindow();
	if (isDev)
		installExtension(REDUX_DEVTOOLS)
			.then((name) => console.log(`Added Extension: ${name}`))
			.catch((err) => console.log("An error occurred: ", err));
});

app.on("window-all-closed", () => {
	sequelize.close();
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});

// electron/db.ts
import { readFileSync } from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { App } from "electron";
const { Sequelize } = require("sequelize");

// function initializeDB(db: sqlite3.Database): sqlite3.Database {
// 	const sqlPath = path.join(__dirname, "../db/initialize.sql");
// 	try {
// 		const sqlContent = readFileSync(sqlPath, "utf-8");
// 		db.exec(sqlContent);
// 	} catch (err) {
// 		console.error("Error initializing the database:", err);
// 	}
// 	return db;
// }

// function setupDB(app: App): sqlite3.Database {
// 	const dbPath = path.join(app.getPath("userData"), "wareflow.sqlite");
//     return new Sequelize({
//         dialect: 'sqlite',
//         storage: dbPath
//     });
// }

// export default setupDB;

// db.js

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './path_to_your_db.sqlite'
});



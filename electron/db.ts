// database.ts

import { Sequelize } from "sequelize";
import {app} from "electron";
const dbPath = app.getPath("userData") + "/db.sqlite";
export const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: dbPath,
});

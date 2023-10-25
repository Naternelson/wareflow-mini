import { Sequelize } from "sequelize";
import { app } from "electron";
const env = process.env.NODE_ENV || "development";
const dbPath = app.getPath("userData") + `/${env}.sqlite`;
export const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: dbPath,
	logging: false
});

import { sequelize } from "./db";
import "./models/associations";
import "./main_request_listener"

const init = async () => {
	await sequelize.sync()
};

init();

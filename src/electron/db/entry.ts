import { sequelize } from "./db";
import "./models/associations";
import "./main_request_listener"

const init = async () => {
	try {
		await sequelize.sync()

	} catch (error) {
		console.error("Error initializing database", error)
	}
};

init();

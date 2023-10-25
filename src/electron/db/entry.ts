import { fstat } from "fs";
import { UserPermission } from "../../common";
import { sequelize } from "./db";
import { Organization, User } from "./models";
import "./models/associations";
import { SeedDb } from "./seed";

const init = async () => {
	const notInProduction = process.env.NODE_ENV !== "production";
	try {
		if (notInProduction) {
			await sequelize.sync({ alter: { drop: false } });
		} else {
			await sequelize.sync();
		}
	} catch (error) {
		console.error("FAILED TO SYNC", error);
	}

	sequelize
		.authenticate()
		.then(async () => {
			console.info("Connection has been established successfully.");

			try {
				const superAdmin = await User.findOne({ where: { permission: UserPermission.SuperAdmin } });
                if (superAdmin) console.log("Super admin exists")
				if (!superAdmin) await SeedDb();
			} catch (error) {
				console.error("User was not added", error);
			}
		})
		.catch((err) => {
			console.error("unable to connect to the database:", err);
		});
};

init();

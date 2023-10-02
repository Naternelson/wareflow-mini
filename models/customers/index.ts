import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../electron/db";

export class Customer extends Model {}

Customer.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: DataTypes.STRING
	},
	{ sequelize, modelName: "customers" }
);


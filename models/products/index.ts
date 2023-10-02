import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../electron/db";

export class Product extends Model {}

Product.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: DataTypes.STRING,
		description: DataTypes.STRING,
		unit_alias: DataTypes.STRING,
		tags: DataTypes.ARRAY(DataTypes.STRING),
		created_at: DataTypes.DATE,
		updated_at: DataTypes.DATE,
	},
	{ sequelize, modelName: "products" }
);

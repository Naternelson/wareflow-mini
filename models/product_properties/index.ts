import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../electron/db";

export class ProductProperty extends Model {}

ProductProperty.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: DataTypes.STRING,
		product_id: {
			type: DataTypes.INTEGER,
			references: {
				model: "products",
				key: "id",
			},
		},
		default_value: DataTypes.STRING,
		options: DataTypes.ARRAY(DataTypes.STRING),
		type: {
			type: DataTypes.TEXT,
			validate: {
				isIn: [["text", "unique text", "options"]],
			},
		},
		created_at: DataTypes.DATE,
		updated_at: DataTypes.DATE,
	},
	{ sequelize, modelName: "products" }
);

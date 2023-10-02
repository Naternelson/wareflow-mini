import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../electron/db";

export class Order extends Model {}

Order.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		status: {
			type: DataTypes.TEXT,
			validate: {
				isIn: [["pending", "picking", "assembling", "shipping", "delivered", "completed", "cancelled"]],
			},
		},
		customer_id: {
			type: DataTypes.INTEGER,
			references: {
				model: "customers",
				key: "id",
			},
		},
		product_id: {
			type: DataTypes.INTEGER,
			references: {
				model: "products",
				key: "id",
			},
		},

		shipping_date: DataTypes.DATE,
		delivered_date: DataTypes.DATE,
		due_by_date: DataTypes.DATE,
		created_at: DataTypes.DATE,
		updated_at: DataTypes.DATE,
	},
	{ sequelize, modelName: "orders" }
);

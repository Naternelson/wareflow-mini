import { sequelize } from "../electron/db";
import { Model, DataTypes } from "sequelize";
import { Product } from "./product";

export class Workflow extends Model {
	public workflowId!: number;
	public name!: string;
	public description?: string;
	public productId!: number;
	public type!: string;
}

Workflow.init(
	{
		workflowId: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		productId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: "products",
				key: "productId",
			},
		},
		type: {
			type: DataTypes.ENUM("building", "picking", "packing", "shipping"),
			allowNull: false,
		},
	},
	{
		tableName: "workflows",
		sequelize,
        paranoid: true
	}
);

Workflow.belongsTo(Product, {
	foreignKey: "productId",
	as: "product",
	onDelete: "CASCADE",
});

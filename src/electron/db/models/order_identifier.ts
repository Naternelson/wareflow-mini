import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../db";
import { Organization } from "./organization";
import { Order } from "./order";

export class OrderIdentifier extends Model<InferAttributes<OrderIdentifier>, InferCreationAttributes<OrderIdentifier>> {
	declare id: number;
	declare orderId: number;
	declare organizationId: number;
	declare name: string;
	declare value: string;
	declare createdAt: Date;
	declare updatedAt: Date;
}

OrderIdentifier.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		orderId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		organizationId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		value: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		sequelize,
		indexes: [
			{
				fields: ["name", "organizationId", "value"],
				unique: true,
			},
		],
	}
);

export const associateOrderIdentifier = () => {
	OrderIdentifier.belongsTo(Order, { foreignKey: "orderId", as: "order" });
	OrderIdentifier.belongsTo(Organization, { foreignKey: "organizationId", as: "organization" });
};

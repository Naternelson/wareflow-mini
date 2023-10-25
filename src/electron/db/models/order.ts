import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../db";
import { Organization } from "./organization";
import { OrderIdentifier } from "./order_identifier";

export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
	declare id: CreationOptional<number>;
	declare organizationId: number;
	declare orderedOn: Date;
	declare dueBy: Date;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Order.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		organizationId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		orderedOn: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		dueBy: {
			type: DataTypes.DATE,
			allowNull: true,
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
		sequelize: sequelize,
		paranoid: true,
	}
);

export const associateOrder = () => {
	Order.belongsTo(Organization, { foreignKey: "organizationId", as: "organization" });

	// Order.hasMany(OrderItem, {foreignKey: "orderId", as: "orderItems"})
	Order.hasMany(OrderIdentifier, { foreignKey: "orderId", as: "orderIdentifiers" });
};

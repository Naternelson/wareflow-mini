import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../db";
import { Organization } from "./organization";
import { Order } from "./order";

export class OrderIdentifier extends Model<InferAttributes<OrderIdentifier>, InferCreationAttributes<OrderIdentifier>> {
	static async getPrimaryIdentifier(orderId: number, organizationId: number): Promise<OrderIdentifier | null> {
		return OrderIdentifier.findOne({
			where: {
				orderId,
				organizationId,
				primary: true,
			},
		});
	}

	declare id: number;
	declare primary: boolean;
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
		primary: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		orderId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		organizationId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		name: { // The Type of IDENTIFIER this is, for instance this could represents the Customer's order ID, or an internal order ID
			type: DataTypes.STRING,
			allowNull: false,
		},
		value: { // The actual value of this identifier, for instance this could be the Customer's order ID, or an internal order ID
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
		hooks: {
			beforeCreate: async (orderIdentifier, options) => {
				if (orderIdentifier.primary) {
					await OrderIdentifier.update(
						{
							primary: false,
						},
						{
							where: {
								orderId: orderIdentifier.orderId,
								organizationId: orderIdentifier.organizationId,
								primary: true,
							},
							transaction: options.transaction,
						}
					);
				}
			},
			beforeUpdate: async (orderIdentifier, options) => {
				if (orderIdentifier.changed("primary") && orderIdentifier.primary) {
					await OrderIdentifier.update(
						{
							primary: false,
						},
						{
							where: {
								orderId: orderIdentifier.orderId,
								organizationId: orderIdentifier.organizationId,
								primary: true,
							},
							transaction: options.transaction,
						}
					);
				}
			},
		},
	}
);

export const associateOrderIdentifier = () => {
	OrderIdentifier.belongsTo(Order, { foreignKey: "orderId", as: "order" });
	OrderIdentifier.belongsTo(Organization, { foreignKey: "organizationId", as: "organization" });
};

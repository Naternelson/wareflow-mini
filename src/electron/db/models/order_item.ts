import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../db";
import { Order } from "./order";
import { Product } from "./product";

export class OrderItem extends Model<InferAttributes<OrderItem>, InferCreationAttributes<OrderItem>> {
	declare id: CreationOptional<number>;
	declare orderId: ForeignKey<number>;
	declare productId: ForeignKey<number>;
	declare quantity: number;
	declare quantityUnit: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

OrderItem.init(
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
		productId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: "products",
				key: "id",
			},
		},
		quantity: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		quantityUnit: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "unit",
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
	}
);

export const associateOrderItem = () => {
	OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });
	OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });
};

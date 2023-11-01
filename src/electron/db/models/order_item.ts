import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../db";
import { Order } from "./order";
import { Product } from "./product";
import { BasicOrderItem, OrderItemStatus } from "../../../common";

export class OrderItem extends Model<InferAttributes<OrderItem>, InferCreationAttributes<OrderItem>> {
	declare id: CreationOptional<number>;
	declare orderId: ForeignKey<number>;
	declare productId: ForeignKey<number>;
	declare quantity: number;
	declare unit: string;
	declare status: string; 
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
	sanitize():BasicOrderItem{
		return this.toJSON();
	}
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
		unit: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "unit",
		},
		status: {
			type: DataTypes.ENUM(...Object.values(OrderItemStatus)),
			allowNull: false,
			defaultValue: OrderItemStatus.PENDING,
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

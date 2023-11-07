import { CreateOptions, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../db";
import { Organization } from "./organization";
import { OrderIdentifier } from "./order_identifier";
import { BasicOrder, NewOrderRequestBody, OrderItemStatus } from "../../../common";
import { OrderItem } from "./order_item";



export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
	declare id: CreationOptional<number>;
	declare organizationId: number;
	declare orderedOn: Date;
	declare customer: string;
	declare dueBy: Date;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
	declare orderIdentifiers: NonAttribute<OrderIdentifier[]>;
	declare organization?: NonAttribute<Organization>;
	declare items: NonAttribute<OrderItem[]>;

	async addIdentifier(
		identifier: { primary: boolean; name: string; value: string },
		options?: CreateOptions<InferAttributes<OrderIdentifier, { omit: never }>>
	): Promise<OrderIdentifier> {
		return await OrderIdentifier.create(
			{ ...identifier, orderId: this.id, organizationId: this.organizationId },
			options
		);
	}
	async addIdentifiers(
		identifiers: { primary: boolean; name: string; value: string }[],
		options?: CreateOptions<InferAttributes<OrderIdentifier, { omit: never }>>
	): Promise<OrderIdentifier[]> {
		return await Promise.all(
			identifiers.map(async (identifier) => {
				return await this.addIdentifier(identifier, options);
			})
		);
	}
	async addItem(
		item: NewOrderRequestBody["items"][0],
		options?: CreateOptions<InferAttributes<OrderItem, { omit: never }>>
	): Promise<OrderItem> {
		const { productId, quantity, unit, status } = item;
		if(!productId || !quantity || !unit || !status) throw new Error("Invalid item") 
		return await OrderItem.create({orderId: this.id, productId, quantity, unit, status }, options);
	}
	async addItems(
		items: NewOrderRequestBody["items"],
		options?: CreateOptions<InferAttributes<OrderItem, { omit: never }>>
	) {
		return await Promise.all(
			items.map(async (item) => {
				return await this.addItem(item, options);
			})
		);
	}
	sanitize(): BasicOrder {
		return this.toJSON();
	}
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
		},
		customer: {
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
		sequelize: sequelize,
		paranoid: true,
	}
);

export const associateOrder = () => {
	Order.belongsTo(Organization, { foreignKey: "organizationId", as: "organization" });

	// Order.hasMany(OrderItem, {foreignKey: "orderId", as: "orderItems"})
	Order.hasMany(OrderIdentifier, { foreignKey: "orderId", as: "orderIdentifiers" });
	Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
};

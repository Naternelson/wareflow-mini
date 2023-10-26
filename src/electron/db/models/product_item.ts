import {
	CreationOptional,
	DataTypes,
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
	Model,
	NonAttribute,
} from "sequelize";
import { Product } from "./product";
import { sequelize } from "../db";
import { ItemIdentifier } from "./item_identifier";
import { Bin } from "./bin";

// The product Item is the actual item that is tracked in inventory
export class ProductItem extends Model<InferAttributes<ProductItem>, InferCreationAttributes<ProductItem>> {
	declare id: CreationOptional<number>;
	declare quantity: number;
	declare readonly createdAt: CreationOptional<Date>;
	declare readonly updatedAt: CreationOptional<Date>;
	declare productId: ForeignKey<Product["id"]>;
	declare product?: NonAttribute<Product>;
	declare binId: ForeignKey<number>;
	declare bin: NonAttribute<Bin>;
	declare itemIdentifiers: NonAttribute<ItemIdentifier[]>;
	// declare workflowLogs: NonAttribute<WorkflowLog[]>;
}

ProductItem.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		productId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: "products",
				key: "id",
			},
		},
		binId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
			references: {
				model: "bins",
				key: "id",
			},
		},
		quantity: {
			// Represents the number of units of the product that this item represents. For instance you may not need to track every unit, but you do need to track a number in a LOT
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			defaultValue: 1,
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
		timestamps: true,
		paranoid: true,
	}
);

export const associateProductItem = () => {
	//
	// BELONGS TO RELATIONSHIPS
	//
	//When the product is deleted, the product item should be deleted
	ProductItem.belongsTo(Product, {
		foreignKey: "productId",
		as: "product",
		onDelete: "CASCADE",
	});
	ProductItem.belongsTo(Bin, {
		foreignKey: "binId",
		as: "bin",
		onDelete: "SET NULL",
	});

	//
	// HAS MANY RELATIONSHIPS
	//
	//When the product item is deleted, the item identifiers should be deleted
	ProductItem.hasMany(ItemIdentifier, {
		foreignKey: "productItemId",
		as: "itemIdentifiers",
		onDelete: "CASCADE",
	});

	// ProductItem.hasMany(WorkflowLog, {
	//     foreignKey: "productItemId",
	//     as: "workflowLogs",
	// })
};

import {
	CreationOptional,
	DataTypes,
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
	Model,
	NonAttribute,
} from "sequelize";
import { sequelize } from "../db";
import { ProductItem } from "./product_item";
import { ProductSpec } from "./product_spec";

// The product Item Identifier is the actual item identifier that is tracked in inventory
export class ItemIdentifier extends Model<InferAttributes<ItemIdentifier>, InferCreationAttributes<ItemIdentifier>> {
	declare id: CreationOptional<number>;
	declare value: string; // This is the actual value of the identifier, it should follow the pattern laid out in the associated product spec
	declare readonly createdAt: CreationOptional<Date>;
	declare readonly updatedAt: CreationOptional<Date>;
	declare productItemId: ForeignKey<ProductItem["id"]>;
	declare productItem?: NonAttribute<ProductItem>;
	declare productSpecId: ForeignKey<ProductSpec["id"]>;
	declare productSpec?: NonAttribute<ProductSpec>;
}

ItemIdentifier.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		value: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		productItemId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: "productItems",
				key: "id",
			},
		},
		productSpecId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: "productSpecs",
				key: "id",
			},
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
		indexes: [
			{
				fields: ["value", "productSpecId"],
				unique: true,
			},
		],
	}
);

export const associateItemIdentifier = () => {
	//
	// BELONGS TO RELATIONSHIPS
	//
	//When the product item is deleted, the item identifier should be deleted
	ItemIdentifier.belongsTo(ProductItem, {
		foreignKey: "productItemId",
		as: "productItem",
		onDelete: "CASCADE",
	});

	//When the product spec is deleted, the item identifier should be nullified
	ItemIdentifier.belongsTo(ProductSpec, {
		foreignKey: "productSpecId",
		as: "productSpec",
		onDelete: "SET NULL",
	});
};

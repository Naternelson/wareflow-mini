import {
	Model,
	DataTypes,
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
	NonAttribute,
	ForeignKey,
} from "sequelize";
import { sequelize } from "../db";
import { Product } from "./product";
import { ItemIdentifier } from "./item_identifier";
import { cleanStringFieldsHooks } from "./utils/cleanStringFields";
import { BasicProductSpec } from "../../../common/models/product_spec";

export class ProductSpec extends Model<InferAttributes<ProductSpec>, InferCreationAttributes<ProductSpec>> {
	declare id: CreationOptional<number>;
	declare name: string;
	declare description: string;
	declare pattern: string; // This is an optional regex pattern that the identifier must match
	declare defaultValue: string; // This is the default value for the identifier
	declare readonly createdAt: CreationOptional<Date>;
	declare readonly updatedAt: CreationOptional<Date>;
	declare productId: ForeignKey<Product["id"]>;
	declare product?: NonAttribute<Product>;
	sanitize():BasicProductSpec{
		return this.toJSON();
	}
}

ProductSpec.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		pattern: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				is: {
					args: /^\/.+\/[a-z]*$/i,
					msg: "Pattern must be a valid regex",
				},
			},
		},
		defaultValue: {
			type: DataTypes.STRING,
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

		productId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: "products",
				key: "id",
			},
		},
	},
	{
		sequelize: sequelize,
		timestamps: true,
		paranoid: true,
		indexes: [
			{
				fields: ["name", "productId"],
				unique: true,
			},
		],
		hooks: cleanStringFieldsHooks<ProductSpec>("name", "description", "pattern", "defaultValue"),
	}
);

export const associateProductSpec = () => {
	//
	// BELONGS TO RELATIONSHIPS
	//
	//When the product is deleted, the product spec should be deleted
	ProductSpec.belongsTo(Product, {
		foreignKey: "productId",
		as: "product",
		onDelete: "CASCADE",
	});

	//
	// HAS MANY RELATIONSHIPS
	//
	//When the product spec is deleted, the Item identifiers should be nullified
	ProductSpec.hasMany(ItemIdentifier, {
		foreignKey: "productSpecId",
		as: "productIdentifiers",
		onDelete: "SET NULL",
	});
};

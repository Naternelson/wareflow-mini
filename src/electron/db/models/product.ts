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
import { Organization } from "./organization";
import { ProductItem } from "./product_item";
import { ProductSpec } from "./product_spec";
import { ProductGroup } from "./product_group";
import { ProductIdentifier } from "./product_identifier";
import { cleanStringFieldsHooks } from "./utils/cleanStringFields";
import { Workflow } from "./workflow";

export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
	declare id: CreationOptional<number>;
	declare name: string;
	declare description: string;
	declare readonly createdAt: CreationOptional<Date>;
	declare readonly updatedAt: CreationOptional<Date>;
	declare organizationId: ForeignKey<Organization["id"]>;
	declare organization?: NonAttribute<Organization>;
	declare productGroupId: ForeignKey<ProductGroup["id"]>;
	declare productGroup?: NonAttribute<ProductGroup>;
	declare productSpecs: NonAttribute<ProductSpec[]>;
	declare productItems: NonAttribute<ProductItem[]>;
	// declare workflows: NonAttribute<Workflow[]>;
}

Product.init(
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
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		productGroupId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
			references: {
				model: "productGroups",
				key: "id",
			},
		},
		organizationId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: "organizations",
				key: "id",
			},
		},
	},
	{
		sequelize: sequelize,
		modelName: "Product",
		tableName: "products",
		timestamps: true,
		paranoid: true,
		indexes: [
			{
				fields: ["name", "organizationId"],
				unique: true,
			},
		],
		hooks: cleanStringFieldsHooks<Product>("name", "description"),
	}
);

//
// BELONGS TO RELATIONSHIPS
//
Product.belongsTo(ProductGroup, {
	foreignKey: "productGroupId",
	as: "productGroup",
});
//When the organization is deleted, the product should be deleted
Product.belongsTo(Organization, {
	foreignKey: "organizationId",
	as: "organization",
	onDelete: "CASCADE",
});

//
// HAS MANY RELATIONSHIPS
//
Product.hasMany(Workflow, {
	foreignKey: "workflowId",
	as: "workflow",
	onDelete: "CASCADE",
});

Product.hasMany(ProductSpec, {
	foreignKey: "productId",
	as: "productSpecs",
	onDelete: "CASCADE",
});

//When product is deleted, the product identifiers should be deleted
Product.hasMany(ProductIdentifier, {
	foreignKey: "productId",
	as: "productIdentifiers",
	onDelete: "CASCADE",
});

Product.hasMany(ProductItem, {
	foreignKey: "productId",
	as: "productItems",
	onDelete: "CASCADE",
});

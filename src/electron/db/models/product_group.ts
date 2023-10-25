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
import { Product } from "./product";
import { cleanStringFieldsHooks } from "./utils/cleanStringFields";

export class ProductGroup extends Model<InferAttributes<ProductGroup>, InferCreationAttributes<ProductGroup>> {
	declare id: CreationOptional<number>;
	declare name: string;
	declare description: string;
	declare readonly createdAt: CreationOptional<Date>;
	declare readonly updatedAt: CreationOptional<Date>;
	declare organizationId: ForeignKey<Organization["id"]>;
	declare organization?: NonAttribute<Organization>;
	declare products: NonAttribute<Product[]>;
}
ProductGroup.init(
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
		timestamps: true,
		paranoid: true,
		indexes: [
			{
				fields: ["name", "organizationId"],
				unique: true,
			},
		],
		hooks: {
			...cleanStringFieldsHooks<ProductGroup>("name", "description"),
		},
	}
);

export const associateProductGroup = () => {
	//
	// BELONGS TO RELATIONSHIPS
	//
	//When the organization is deleted, the product group should be deleted
	ProductGroup.belongsTo(Organization, {
		foreignKey: "organizationId",
		as: "organization",
		onDelete: "CASCADE",
	});

	//
	// HAS MANY RELATIONSHIPS
	//
	// When the product group is deleted the products should NOT be deleted
	ProductGroup.hasMany(Product, {
		foreignKey: "productGroupId",
		as: "products",
		onDelete: "SET NULL",
	});
};

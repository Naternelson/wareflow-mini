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
import { Product } from "./product";
import { cleanStringFields, cleanStringFieldsHooks } from "./utils/cleanStringFields";
import { cleanString } from "../../utils";
import { Organization } from "./organization";
import { BasicProductIdentifier, ProductIdentifierType } from "../../../common/models/product-identifier";

// The product Identifier should identify the Product, eg UPC, EAN, ISBN, or a custom string identifier
export class ProductIdentifier extends Model<
	InferAttributes<ProductIdentifier>,
	InferCreationAttributes<ProductIdentifier>
> {
	declare id: CreationOptional<number>;
	declare primary: boolean;
	declare name: string;
	declare type: string;
	declare value: string; // This is the actual value of the identifier
	declare readonly createdAt: CreationOptional<Date>;
	declare readonly updatedAt: CreationOptional<Date>;
	declare organizationId: ForeignKey<number>;
	declare productId: ForeignKey<Product["id"]>;
	declare product?: NonAttribute<Product>;

	sanitize():BasicProductIdentifier{
		const safe = this.toJSON() 
		return {
			id: safe.id,
			primary: safe.primary,
			name: safe.name,
			type: safe.type as ProductIdentifierType,
			value: safe.value,
			createdAt: safe.createdAt,
			updatedAt: safe.updatedAt,
			productId: safe.productId,
			organizationId: safe.organizationId,
		}
	}
}

ProductIdentifier.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		primary: {
			// Whether this is the primary identifier for the product
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		organizationId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: "organizations",
				key: "id",
			},
		},
		name: {
			// The name of the identifier, eg UPC, EAN, ISBN, or a custom string identifier
			type: DataTypes.STRING,
			allowNull: true,
		},
		type: {
			// Special identifiers that allow for unique identification of a product, eg UPC, EAN, ISBN, or a custom string identifier
			type: DataTypes.ENUM(...Object.values(ProductIdentifierType)),
			allowNull: false,
			defaultValue: ProductIdentifierType.OTHER,
		},
		value: {
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
				fields: ["name", "type", "value", "productId", "organizationId"],
				unique: true,
			},
		],
		hooks: {
			beforeValidate: cleanStringFields<ProductIdentifier>(["name", "value"]),
			beforeCreate: async (instance, options) => {
				if(!instance.name) instance.name = instance.type;
				if (instance.primary) {
					await ProductIdentifier.update(
						{ primary: false },
						{
							where: {
								productId: instance.productId,
								organizationId: instance.organizationId,
								primary: true,
							},
							transaction: options.transaction,
						}
					);
				}
			},
			beforeUpdate: async (instance, options) => {
				if(!instance.name) instance.name = instance.type;
				if (instance.changed("primary") && instance.primary) {
					await ProductIdentifier.update(
						{ primary: false },
						{
							where: {
								productId: instance.productId,
								organizationId: instance.organizationId,
								primary: true,
							},
							transaction: options.transaction,
						}
					);
				}
			}
		},
	}
);
ProductIdentifier.addHook("beforeValidate", cleanStringFields<ProductIdentifier>(["name", "value"]));
//
// BELONGS TO RELATIONSHIPS
//
//When the product is deleted, the product identifier should be deleted

export const associateProductIdentifier = () => {
	ProductIdentifier.belongsTo(Product, {
		foreignKey: "productId",
		as: "product",
		onDelete: "CASCADE",
	});
	ProductIdentifier.belongsTo(Organization, {
		foreignKey: "organizationId",
		as: "organization",
	});
	
};

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
import { cleanStringFieldsHooks } from "./utils/cleanStringFields";


// The product Identifier should identify the Product, eg UPC, EAN, ISBN, or a custom string identifier
export class ProductIdentifier extends Model<InferAttributes<ProductIdentifier>, InferCreationAttributes<ProductIdentifier>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare type: string; 
    declare value: string; // This is the actual value of the identifier
    declare readonly createdAt: CreationOptional<Date>;
    declare readonly updatedAt: CreationOptional<Date>;
    declare productId: ForeignKey<Product["id"]>;
    declare product?: NonAttribute<Product>;
}

ProductIdentifier.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: { // The name of the identifier, eg UPC, EAN, ISBN, or a custom string identifier
        type: DataTypes.STRING,
        allowNull: false,

    },
    type: { // Special identifiers that allow for unique identification of a product, eg UPC, EAN, ISBN, or a custom string identifier
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [["UPC", "EAN", "ISBN", "CUSTOM"]],
                msg: "Type must be one of UPC, EAN, ISBN, or CUSTOM"
            }
        }
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
            key: "id"
        }
    },
}, {
    sequelize:sequelize,
    modelName: "ProductIdentifier",
    tableName: "productIdentifiers",
    timestamps: true,
    paranoid: true,
    indexes: [
        {
            fields: ["type", "value", "productId"],
            unique: true,
        }
    ],
    hooks: cleanStringFieldsHooks<ProductIdentifier>("name", "value"),
});

//
// BELONGS TO RELATIONSHIPS
//
//When the product is deleted, the product identifier should be deleted
ProductIdentifier.belongsTo(Product, {
    foreignKey: "productId",
    as: "product",
    onDelete: "CASCADE",
})
import { sequelize } from "../electron/db";
import { Model, DataTypes } from "sequelize";
import { Product } from "./product";

export class ProductProperty extends Model {
    public productPropertyId!: number;
    public productId!: number;
    public name!: string;
    public patternDefaultValue?: string; 
    public patternMaxLength?: number;
    public patternMinLength?: number;
    public patternExactLength?: number;
    public patternMaxItemQuantity?: number;
    public patternMinItemQuantity?: number;
    public patternExactItemQuantity?: number;
    public patternOnlyNumbers?: boolean;
    public patternOnlyLetters?: boolean;
    public patternOnlyAlphanumeric?: boolean;
    public patternIncludeChars?: string;
    public patternExcludeChars?: string;
    public patternRegex?: string;
}

ProductProperty.init({
    productPropertyId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: "products",
            key: "productId",
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    patternDefaultValue: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    patternMaxLength: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    patternMinLength: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    patternExactLength: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    patternMaxItemQuantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    patternMinItemQuantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    patternExactItemQuantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    patternOnlyNumbers: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    patternOnlyLetters: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    patternOnlyAlphanumeric: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    patternIncludeChars: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    patternExcludeChars: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    patternRegex: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            is: /^\/.*\/[gimuy]*$/i,
        }
    },
}, {
    tableName: "product_properties",
    sequelize,
    paranoid: true
})

ProductProperty.belongsTo(Product, {
    foreignKey: "productId",
    as: "product",
    onDelete: "CASCADE",
})
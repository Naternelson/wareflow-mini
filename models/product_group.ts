import { sequelize } from "../electron/db";
import { Model, DataTypes } from "sequelize";
import { Product } from "./product";

export class ProductGroup extends Model {
    public productGroupId!: number;
    public productId!: number;
    public tag!: string;
}

ProductGroup.init({
    productGroupId: {
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
    tag: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: "product_groups",
    sequelize,
    paranoid: true
})

ProductGroup.belongsTo(Product, {
    foreignKey: "productId",
    as: "product",
    onDelete: "CASCADE",
})
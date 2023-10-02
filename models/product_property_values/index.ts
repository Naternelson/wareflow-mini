import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../electron/db";

export class ProductPropertyValue extends Model {}

ProductPropertyValue.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        value: DataTypes.STRING,
        product_property_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "product_properties",
                key: "id",
            },
        },
        product_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "products",
                key: "id",
            },
        },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
    },
    { sequelize, modelName: "product_property_values" }
);
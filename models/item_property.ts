import { DataTypes, Model } from "sequelize";
import { sequelize } from "../electron/db";
import { OrderItem } from "./order_item";

export class ItemProperty extends Model {
    public itemPropertyId!: number;
    public productPropertyId!: number; 
    public value!: string;
    public orderItemId!: number;
    public valid?: boolean;
}

ItemProperty.init({
    itemPropertyId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    productPropertyId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: "product_properties",
            key: "productPropertyId",
        }
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    orderItemId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: "order_items",
            key: "orderItemId",
        }
    },
    valid: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    }
}, {
    tableName: "item_properties",
    sequelize,
})

ItemProperty.belongsTo(OrderItem, {
    foreignKey: "orderItemId",
    as: "orderItem",
    onDelete: "CASCADE"
})
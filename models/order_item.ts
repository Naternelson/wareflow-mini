import { DataTypes, Model } from "sequelize";
import { sequelize } from "../electron/db";
import { OrderProduct } from "./order_product";

export class OrderItem extends Model {
    public orderItemId!: number;
    public orderProductId!: number;
    public quantity!: number;
    public bindId?: number;
}

OrderItem.init({
    orderItemId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    orderProductId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: "order_products",
            key: "orderProductId",
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bindId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    }
}, {
    tableName: "order_items",
    sequelize,
})

OrderItem.belongsTo(OrderProduct, {
    foreignKey: "orderProductId",
    as: "orderProduct",
})
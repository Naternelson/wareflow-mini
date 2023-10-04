import { DataTypes, Model } from "sequelize";
import { sequelize } from "../electron/db";
import { Order } from "./order";

export class OrderProduct extends Model {
    public orderProductId!: number;
    public orderId!: number;
    public productId!: number;
    public quantity!: number;
    public price?: number;
    public discount?: number;
    public notes?: string;
}

OrderProduct.init({
    orderProductId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    orderId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: "orders",
            key: "orderId",
        }
    },
    productId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: "products",
            key: "productId",
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    tableName: "order_products",
    sequelize,
})

OrderProduct.belongsTo(Order, {
    foreignKey: "orderId",
    as: "order",
    onDelete: "CASCADE",
})
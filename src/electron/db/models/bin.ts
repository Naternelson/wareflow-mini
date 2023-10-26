import { Model, ForeignKey, CreationOptional, InferAttributes, InferCreationAttributes, DataTypes } from "sequelize";
import { sequelize } from "../db";
import { Order } from "./order";
import { ProductItem } from "./product_item";

export class Bin extends Model<InferAttributes<Bin>, InferCreationAttributes<Bin>> {
    declare id: CreationOptional<number>;
    declare secondaryId: string; 
    declare organizationId: ForeignKey<number>;
    declare orderId: ForeignKey<number>;
    declare shipmentId: ForeignKey<number>;
    declare binSize: number; 
    declare location: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Bin.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "orders",
            key: "id",
        }
    },
    secondaryId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shipmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "shipments",
            key: "id",
        }
    },
    binSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    location: {
        type: DataTypes.STRING,
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
}, {
    sequelize,
})

export const associateBin = () => {
     Bin.belongsTo(Order, { foreignKey: "orderId", as: "order" });
    //  Bin.belongsTo(Shipment, { foreignKey: "shipmentId", as: "shipment" });
    Bin.hasMany(ProductItem, { foreignKey: "binId", as: "productItems" });
}
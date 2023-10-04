import { DataTypes, Model } from "sequelize";
import { sequelize } from "../electron/db";
import { Order } from "./order";

export class ShipGroup extends Model {
    public shipGroupId!: number;
    public size!: number;
    public orderId!: number;
    public shipDate?: Date;
    public carrierId?: number;
    public trackingNumber?: string;
    public status!: string;
    public outboundLocation?: string;
    public outboundAddress?: number;
}
ShipGroup.init({
    shipGroupId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    shipDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    carrierId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: "business_partners",
            key: "carrierId",
        }
    },
    trackingNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM("pending", "picking", "shipped", "delivered", "cancelled"),
        allowNull: false,
    },
    outboundLocation: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    outboundAddress: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "addresses",
            key: "addressId",
        }
    },
}, {
    tableName: "ship_groups",
    sequelize,
    paranoid: true,
});

ShipGroup.belongsTo(Order, {
    foreignKey: "orderId",
    as: "order",
})

// ShipGroup.belongsTo(BusinessPartner, {
//     foreignKey: "carrierId",
//     as: "carrier",
// })

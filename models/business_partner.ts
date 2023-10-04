import { DataTypes, Model } from "sequelize";
import { sequelize } from "../electron/db";
import { Organization } from "./organization";

export class BusinessPartner extends Model {
    public businessPartnerId!: number;
    public name!: string;
    public phone?: string;
    public address?: number;
    public type!: string
    public organizationId!: number; // Organization that this business partner belongs to
}

BusinessPartner.init({
    businessPartnerId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: "addresses",
            key: "addressId",
        },
    },
    type: {
        type: DataTypes.ENUM("customer", "vendor", "carrier", "any"),
        allowNull: false,
        defaultValue: "any",
    },
    organizationId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: "organizations",
            key: "organizationId",
        },
    },
}, {
    tableName: "business_partners",
    sequelize,
    paranoid: true,
})

BusinessPartner.belongsTo(Organization, {
    foreignKey: "organizationId",
    as: "organization",
    onDelete: "CASCADE",
})
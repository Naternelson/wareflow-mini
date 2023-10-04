import { DataTypes, Model } from "sequelize";
import { sequelize } from "../electron/db";

export class Address extends Model {
    public addressId!: number;
    public street?: string;
    public secondary?: string;
    public city?: string;
    public state?: string;
    public zip?: string;
    public country?: string;
    public latitude?: number;
    public longitude?: number;
}


Address.init({
    addressId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    street: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    secondary: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    zip: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
}, {
    tableName: "addresses",
    sequelize,
})

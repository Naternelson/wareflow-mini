import { DataTypes, Model } from "sequelize";
import { sequelize } from "../electron/db";
import { BinSpec } from "./bin_spec";

export class Bin extends Model {
    public binId!: number;
    public customBinId!: string; // Only unique to the organization
    public shipGroupId?: number;
    public binSpecId?: number;
}

Bin.init({
    binId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    customBinId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shipGroupId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    binSpecId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: "bins",
    sequelize,
    paranoid: true,
});

Bin.belongsTo(BinSpec, {
    foreignKey: "binSpecId",
    as: "binSpec",
})

// Bin.belongsTo(ShipGroup, {
//     foreignKey: "shipGroupId",
//     as: "shipGroup",
// })
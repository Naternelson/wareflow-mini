import { sequelize } from "../electron/db";
import { Model, DataTypes } from "sequelize";
import { Workflow } from "./workflow";

export class BinSpec extends Model {
    public binSpecId!: number;
    public workflowId!: number; 
    public binIdPatter?: string;
    public uid?: boolean
    public patternMaxBinSize?: number;
    public patternMinBinSize?: number;
    public patternExactBinSize?: number;
    public groupByProperty?: string
}


BinSpec.init({
    binSpecId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    workflowId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: "workflows",
            key: "workflowId",
        }
    },
    binIdPattern: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    uid: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    patternMaxBinSize: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    patternMinBinSize: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    patternExactBinSize: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    groupByProperty: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: "bin_specs",
    sequelize,
    paranoid: true,
})

BinSpec.belongsTo(Workflow, {
    foreignKey: "workflowId",
    as: "workflow",
    onDelete: "CASCADE",
})
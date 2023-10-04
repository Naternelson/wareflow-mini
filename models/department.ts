import { sequelize } from "../electron/db";
import { Model,  DataTypes } from "sequelize";
import { Organization } from "./organization";

export class Department extends Model {
    public departmentId!: number;
    public name!: string;
    public organizationId!: number;
    public description?: string;

}

Department.init({
    departmentId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    organizationId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: "organizations",
            key: "organizationId",
        
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: "departments",
    sequelize,
    paranoid: true, 
})

Department.belongsTo(Organization, {
    foreignKey: "organizationId",
    as: "organization",
    onDelete: "CASCADE",
})

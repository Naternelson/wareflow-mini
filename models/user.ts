import { sequelize } from "../electron/db";
import { Model, DataTypes } from "sequelize";
import { OrganizationRole } from "./organization_role";
import { Department } from "./department";

export class User extends Model {
    public userId!: number;
    public firstName!: string;
    public lastName!: string;
    public displayName!: string;
    public phontoURL?: string; 
    public email!: string;
    public password!: string;
    public organizationRoleId!: number;
    public departmentId?: number;
}

User.init({
    userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    displayName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    photoURL: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        }
    },
    password: {
        // Ensure this is hashed and salted before storing
        type: DataTypes.STRING,
        allowNull: true,
    },
    organizationRoleId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: "organization_roles",
            key: "organizationRoleId",
        }
    },
    departmentId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: "departments",
            key: "departmentId",
        }
    },
}, {
    tableName: "users",
    sequelize,
    paranoid: true
})

User.belongsTo(OrganizationRole, {
    foreignKey: "organizationRoleId",
    as: "organizationRole",
})

User.belongsTo(Department, {
    foreignKey: "departmentId",
    as: "department",
})
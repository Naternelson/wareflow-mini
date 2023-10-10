// /models/user.ts

import { sequelize } from "../electron/db";
import { Model, DataTypes } from "sequelize";
import { OrganizationRole } from "./organization_role";
import { Department } from "./department";

export type UserAttributes = {
	userId?: number; // primaryKey and autoIncrement fields can be optional
	firstName: string;
	lastName: string;
	displayName: string;
	photoURL?: string;
	email: string;
	password?: string;
	organizationRoleId: number;
	departmentId?: number;
	lastLogin?: Date;
	createdAt?: Date; // Make these optional
	updatedAt?: Date; // Make these optional
};


export class User extends Model<UserAttributes> implements UserAttributes {
    public userId!: number;
    public firstName!: string;
    public lastName!: string;
    public displayName!: string;
    public photoURL?: string; 
    public email!: string;
    public password?: string;
    public organizationRoleId!: number;
    public departmentId?: number;
    public lastLogin?: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    organizationRole?: OrganizationRole;
    department?: Department;
}

// export class User extends Model {
//     public userId!: number;
//     public firstName!: string;
//     public lastName!: string;
//     public displayName!: string;
//     public photoURL?: string; 
//     public email!: string;
//     public password!: string;
//     public organizationRoleId!: number;
//     public departmentId?: number;
//     public lastLogin?: Date;
//     public readonly createdAt!: Date;
//     public readonly updatedAt!: Date;

//     organizationRole?: OrganizationRole;
//     department?: Department;
// }

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
        unique: true,
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
    lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    tableName: "users",
    sequelize,
    paranoid: true
})

User.belongsTo(OrganizationRole, {
	foreignKey: "organizationRoleId",
	as: "organizationRole", 
});

User.belongsTo(Department, {
    foreignKey: "departmentId",
    as: "department",
})

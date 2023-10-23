import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../db";
import { User } from "./user";

export class LoginLog extends Model<InferAttributes<LoginLog>, InferCreationAttributes<LoginLog>>{
    
    declare id: CreationOptional<number>;
    declare userId: number;
    declare ip?: string;
    declare userAgent?: string;
    declare outcome: string;
    
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

LoginLog.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        }
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userAgent: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    outcome: {
        type: DataTypes.ENUM("success", "failure"),
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    sequelize: sequelize,
    tableName: "loginLogs",
    paranoid: true,
})


LoginLog.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
})
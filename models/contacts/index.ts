import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../electron/db";

export class Contact extends Model {}

Contact.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    gender: {
        type: DataTypes.TEXT,
        validate: {
            isIn: [["male", "female", "trans-male", "trans-female", "non-binary", "other"]]
        }
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    customer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Contact,
            key: "id",
        },
    }
    
}, { sequelize, modelName: "contacts"})


import { DataTypes, Model } from "sequelize";
import { sequelize } from "../electron/db";
import { BusinessPartner } from "./business_partner";

export class Contact extends Model {
    public contactId!: number;
    public firstName!: string;
    public lastName!: string;
    public displayName!: string;
    public phone?: string;
    public email?: string;
    public location?: number;
    public title?: string;
    public department?: string;
    public buisnessPartnerId!: number;
}

Contact.init({
    contactId: {
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
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true,
        }
    },
    location: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: "addresses",
            key: "addressId",
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    buisnessPartnerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: "buisness_partners",
            key: "buisnessPartnerId",
        }
    },
}, {
    tableName: "contacts",
    sequelize,
    paranoid: true,
});

Contact.belongsTo(BusinessPartner, {
    foreignKey: "buisnessPartnerId",
    as: "buisnessPartner",
    onDelete: "CASCADE",
})

// Contact.belongsTo(Address, {
//     foreignKey: "location",
//     as: "location",
// })



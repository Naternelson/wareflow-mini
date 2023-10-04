import { DataTypes, Model } from "sequelize";
import { sequelize } from "../electron/db";
import { Organization } from "./organization";

export class DocumentTemplate extends Model {
    public documentTemplateId!: number;
    public name!: string;
    public description?: string;
    public organizationId!: number;
    public template?: string;
}

DocumentTemplate.init({
    documentTemplateId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    organizationId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: "organizations",
            key: "organizationId",
        },
    },
    template: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: "document_templates",
    sequelize,
    paranoid: true, 
})

DocumentTemplate.belongsTo(Organization, {
    foreignKey: "organizationId",
    as: "organization",
    onDelete: "CASCADE",
})
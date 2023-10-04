import { sequelize } from "../electron/db";
import { Model, DataTypes } from "sequelize";
import { Workflow } from "./workflow";

export class WorkflowStep extends Model {
    public workflowStepId!: number;
    public workflowId!: number;
    public name!: string;
    public type!: string ; 
    public targetProperty?: string;
    public triggerMatch?: string;
    public triggerLength?: number;
    public triggerNumber?: number;
    public requestPermission!: boolean;
    public requestPermissionMessage?: string;
    public documentTemplateId?: number;
    public emailTemplateId?: number;
    public contactId?: number;
}
WorkflowStep.init({
    workflowStepId: {
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
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    targetProperty: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    triggerMatch: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    triggerLength: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    triggerNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    requestPermission: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    requestPermissionMessage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    documentTemplateId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: "document_templates",
            key: "documentTemplateId",
        }
    },
    emailTemplateId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: "email_templates",
            key: "emailTemplateId",
        }
    },
    contactId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: "contacts",
            key: "contactId",
        }
    },
}, {
    tableName: "workflow_steps",
    sequelize,
    paranoid: true
})

WorkflowStep.belongsTo(Workflow, {
    foreignKey: "workflowId",
    as: "workflow",
    onDelete: "CASCADE",
})

// WorkflowStep.belongsTo(DocumentTemplate, {
//     foreignKey: "documentTemplateId",
//     as: "documentTemplate",
// })

// WorkflowStep.belongsTo(EmailTemplate, {
//     foreignKey: "emailTemplateId",
//     as: "emailTemplate",
// })

// WorkflowStep.belongsTo(Contact, {
//     foreignKey: "contactId",
//     as: "contact",
// })
import {
	CreationOptional,
	DataTypes,
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
	Model,
	NonAttribute,
} from "sequelize";
import { sequelize } from "../db";
import { Organization } from "./organization";
import { cleanStringFieldsHooks } from "./utils/cleanStringFields";
import { Product } from "./product";
import { TaskGroup } from "./task_group";

type AssociationInstance = Product | null;
const AssociatedTableNames = [Product.tableName];
export class Workflow extends Model<InferAttributes<Workflow>, InferCreationAttributes<Workflow>> {
	declare id: CreationOptional<number>;
	declare name: string;
	declare description: string;
	declare organizationId: ForeignKey<Organization["id"]>;
	declare readonly createdAt: CreationOptional<Date>;
	declare readonly updatedAt: CreationOptional<Date>;
	declare associationTable: string;
	declare associationId: number;
	declare tasks: NonAttribute<TaskGroup[]>;
	declare getAssociation: () => Promise<AssociationInstance>;
}

Workflow.prototype.getAssociation = async function (this: Workflow) {
	try {
		switch (this.associationTable) {
			case Product.tableName:
				return await Product.findByPk(this.associationId);
			default:
				return null;
		}
	} catch (error) {
		console.error(error);
		return null;
	}
};

Workflow.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		organizationId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: "organizations",
				key: "id",
			},
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},

		associationTable: {
			// Workflows could be assigned to products, product items, orders, shipments, etc
			type: DataTypes.ENUM(...AssociatedTableNames),
			allowNull: false,
		},
		associationId: {
			// The id of the record in the association table
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
	},
	{
		sequelize: sequelize,
		modelName: "Workflow",
		tableName: "workflows",
		timestamps: true,
		paranoid: true,
		indexes: [
			{
				fields: ["name", "associationTable", "associationId", "organizationId"],
				unique: true,
			},
		],
		hooks: cleanStringFieldsHooks<Workflow>("name", "description"),
	}
);

//
// BELONGS TO RELATIONSHIPS
//
Workflow.belongsTo(Organization, {
	foreignKey: "organizationId",
	as: "organization",
	onDelete: "CASCADE",
});

//
// HAS MANY RELATIONSHIPS
//
Workflow.hasMany(TaskGroup, {
	foreignKey: "workflowId",
	as: "tasks",
	onDelete: "CASCADE",
});

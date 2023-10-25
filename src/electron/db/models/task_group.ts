import {
	DataTypes,
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	ForeignKey,
	NonAttribute,
} from "sequelize";
import { sequelize } from "../db";
import { Task } from "./task";
import { TaskRelationship } from "./task_relationship";
import { Workflow } from "./workflow";
import { cleanStringFieldsHooks } from "./utils/cleanStringFields";

export class TaskGroup extends Model<InferAttributes<TaskGroup>, InferCreationAttributes<TaskGroup>> {
	declare id: CreationOptional<number>;
	declare name: string;
	declare description: string;
	declare readonly createdAt: CreationOptional<Date>;
	declare readonly updatedAt: CreationOptional<Date>;
	declare workflowId: ForeignKey<Workflow["id"]>;
	declare workflow?: NonAttribute<Workflow>;
	declare tasks: NonAttribute<Task[]>;
	declare taskRelationships: NonAttribute<TaskRelationship[]>;
}

TaskGroup.init(
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
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},

		workflowId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: "workflows",
				key: "id",
			},
		},
	},
	{
		sequelize: sequelize,
		timestamps: true,
		paranoid: true,
		indexes: [
			{
				fields: ["name", "workflowId"],
				unique: true,
			},
		],
		hooks: cleanStringFieldsHooks<TaskGroup>("name", "description"),
	}
);

export const associateTaskGroup = () => {
	//
	// BELONGS TO RELATIONSHIPS
	//
	TaskGroup.belongsTo(Workflow, {
		foreignKey: "workflowId",
		as: "workflow",
		onDelete: "CASCADE",
	});

	//
	// HAS MANY RELATIONSHIPS
	//
	TaskGroup.hasMany(Task, {
		foreignKey: "taskGroupId",
		as: "tasks",
		onDelete: "CASCADE",
	});

	TaskGroup.hasMany(TaskRelationship, {
		foreignKey: "taskGroupId",
		as: "taskRelationships",
		onDelete: "CASCADE",
	});
};

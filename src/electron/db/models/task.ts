import {
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	ForeignKey,
	NonAttribute,
	DataTypes,
} from "sequelize";
import { sequelize } from "../db";
import { TaskGroup } from "./task_group";
import { TaskRelationship } from "./task_relationship";
export class Task extends Model<InferAttributes<Task>, InferCreationAttributes<Task>> {
	declare id: CreationOptional<number>;
	declare type: string; // The type of task, eg requestItemIdentifier, requestItemCount, etc
	declare associatedTable: string; // The table that the task is associated with, eg product spec, item identifier, label Template,   etc. This table should outline the params for this taks to undertake
	declare associatedId: number; // The id of the record in the associated table
	declare timeout: number; // The amount of time in seconds that the task will wait for a response before timing out
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
	declare taskGroupId: ForeignKey<TaskGroup["id"]>;
	declare taskGroup?: NonAttribute<TaskGroup>;
	declare taskRelationships: NonAttribute<TaskRelationship[]>;
}
const TaskTypes = ["requestItemIdentifier", "labelPrint", "email"];
Task.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		type: {
			type: DataTypes.ENUM(...TaskTypes),
			allowNull: false,
		},
		associatedTable: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		associatedId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		timeout: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			defaultValue: 0,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},

		taskGroupId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: "taskGroups",
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
				fields: ["type", "associatedTable", "associatedId", "taskGroupId"],
				unique: true,
			},
		],
		hooks: {},
	}
);
export const associateTask = () => {
	//
	// BELONGS TO RELATIONSHIPS
	//
	TaskRelationship.belongsTo(TaskGroup, {
		foreignKey: "taskGroupId",
		as: "taskGroup",
		onDelete: "CASCADE",
	});

	//
	// HAS MANY RELATIONSHIPS
	//
	TaskRelationship.hasMany(Task, {
		foreignKey: "taskRelationshipId",
		as: "tasks",
		onDelete: "CASCADE",
	});
};

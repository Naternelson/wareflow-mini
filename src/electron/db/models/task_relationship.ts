import {
	DataTypes,
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	NonAttribute,
	ForeignKey,
} from "sequelize";
import { sequelize } from "../db";
import { Task } from "./task";
import { TaskGroup } from "./task_group";

export class TaskRelationship extends Model<
	InferAttributes<TaskRelationship>,
	InferCreationAttributes<TaskRelationship>
> {
	declare id: CreationOptional<number>;
	declare trigger: string; // The trigger for the task, eg success, failure, timeout, etc
	declare targetTaskId: ForeignKey<Task["id"]>;
	declare nextTaskId: ForeignKey<Task["id"]>;
	declare targetTaskGroupId: ForeignKey<TaskGroup["id"]>;
	declare nextTaskGroupId: ForeignKey<TaskGroup["id"]>;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
	declare targetTask?: NonAttribute<Task>;
	declare targetTaskGroup?: NonAttribute<TaskGroup>;
	declare nextTask?: NonAttribute<Task>;
	declare nextTaskGroup?: NonAttribute<TaskGroup>;
}

// The Task Relationship outlines the conditions for the next task to be executed
// It indicates what task to look for, and when the task log indicates that the task was resolved, it indicates the next task to execute
// The trigger indicates the condition for the next task to be executed, eg success, failure, timeout, etc
// If the next task is null, this indicates the end of the chain
// There should be one task relationship for each trigger, target task, and next task. It should not have a target task and a target task group, or a next task and a next task group. Next task and next task group can both be null at the same time, indicating the end of the chain
TaskRelationship.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		trigger: {
			type: DataTypes.ENUM("success", "failure", "timeout", "resolved"),
			allowNull: false,
		},
		targetTaskGroupId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
			references: {
				model: "taskGroups",
				key: "id",
			},
		},
		targetTaskId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
			references: {
				model: "tasks",
				key: "id",
			},
		},
		nextTaskId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
			references: {
				model: "tasks",
				key: "id",
			},
		},
		nextTaskGroupId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
			references: {
				model: "taskGroups",
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
	},
	{
		sequelize: sequelize,
		timestamps: true,
		paranoid: true,
		indexes: [
			{
				fields: ["trigger", "targetTaskId", "nextTaskId", "targetTaskGroupId", "nextTaskGroupId"],
				unique: true,
			},
		],
		hooks: {},
	}
);

export const associateTaskRelationship = () => {
	//
	// BELONGS TO RELATIONSHIPS
	//
	TaskRelationship.belongsTo(TaskGroup, {
		foreignKey: "targetTaskGroupId",
		as: "targetTaskGroup",
		onDelete: "CASCADE",
	});
	TaskRelationship.belongsTo(Task, {
		foreignKey: "targetTaskId",
		as: "targetTask",
		onDelete: "CASCADE",
	});
	TaskRelationship.belongsTo(TaskGroup, {
		foreignKey: "nextTaskGroupId",
		as: "nextTaskGroup",
		onDelete: "CASCADE",
	});
	TaskRelationship.belongsTo(Task, {
		foreignKey: "nextTaskId",
		as: "nextTask",
		onDelete: "CASCADE",
	});

	// //
	// // HAS MANY RELATIONSHIPS
	// //
	// TaskRelationship.hasMany(Task, {
	// 	foreignKey: "taskRelationshipId",
	// 	as: "tasks",
	// 	onDelete: "CASCADE",
	// });
};

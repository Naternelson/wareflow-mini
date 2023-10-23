import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from "sequelize";
import { sequelize } from "../db";
import { Task } from "./task";
import { TaskGroup } from "./task_group";
import { Organization } from "./organization";
import { User } from "./user";
import { TaskRelationship } from "./task_relationship";


export class TaskLog extends Model<InferAttributes<TaskLog>, InferCreationAttributes<TaskLog>> {
	declare id: CreationOptional<number>;
	declare taskId: ForeignKey<Task["id"]>;
	declare taskGroupId: ForeignKey<TaskGroup["id"]>;
	declare outcome: string;
	declare organizationId: ForeignKey<Organization["id"]>;
	declare userId: ForeignKey<User["id"]>;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
	declare task?: NonAttribute<Task>;
	declare organization?: NonAttribute<Organization>;
	declare user?: NonAttribute<User>;
	declare taskRelationships: NonAttribute<TaskRelationship[]>;
}

TaskLog.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		taskId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
			references: {
				model: "tasks",
				key: "id",
			},
		},
		taskGroupId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
			references: {
				model: "taskGroups",
				key: "id",
			},
		},
		outcome: {
			type: DataTypes.ENUM("success", "failure", "timeout", "resolved"),
			allowNull: false,
		},
		organizationId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: "organizations",
				key: "id",
			},
		},
		userId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: "users",
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
		modelName: "TaskLog",
		tableName: "taskLogs",
		timestamps: true,
		paranoid: true,
		indexes: [
			{
				fields: ["taskId", "taskGroupId", "outcome", "organizationId", "userId"],
				unique: true,
			},
		],
		hooks: {},
	}
);

//
// BELONGS TO RELATIONSHIPS
//
TaskLog.belongsTo(Task, {
	foreignKey: "taskId",
	as: "task",
	// onDelete: "CASCADE",
});

TaskLog.belongsTo(TaskGroup, {
	foreignKey: "taskGroupId",
	as: "taskGroup",
	// onDelete: "CASCADE",
});

TaskLog.belongsTo(Organization, {
	foreignKey: "organizationId",
	as: "organization",
	// onDelete: "CASCADE",
});

TaskLog.belongsTo(User, {
	foreignKey: "userId",
	as: "user",
	// onDelete: "CASCADE",
});

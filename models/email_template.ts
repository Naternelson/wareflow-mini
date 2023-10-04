import { DataTypes, Model } from "sequelize";
import { sequelize } from "../electron/db";
import { Organization } from "./organization";

export class EmailTemplate extends Model {
	public emailTemplateId!: number;
	public name!: string;
	public subject?: string;
	public body?: string;
	public organizationId!: number;
}

EmailTemplate.init(
	{
		emailTemplateId: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		subject: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		body: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		tableName: "email_templates",
		sequelize,
		paranoid: true,
	}
);

EmailTemplate.belongsTo(Organization, {
	foreignKey: "organizationId",
	as: "organization",
	onDelete: "CASCADE",
});

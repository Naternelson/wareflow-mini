import { sequelize } from "../electron/db";
import { Model, DataTypes } from "sequelize";
import { Organization } from "./organization";

export class OrganizationRole extends Model {
	public organizationUserId!: number;
	public organizationId!: number;
	public role!: string;
}

OrganizationRole.init(
	{
		organizationUserId: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		organizationId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: "organizations",
				key: "organizationId",
			},
		},
		role: {
			type: DataTypes.ENUM("admin", "user"),
		},
	},
	{
		tableName: "organization_roles",
		sequelize,
        paranoid: true
	}
);

OrganizationRole.belongsTo(Organization, {
	foreignKey: "organizationId",
	as: "organization",
	onDelete: "CASCADE",
});

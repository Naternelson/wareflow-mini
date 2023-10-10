// /models/organization_role.ts

import { sequelize } from "../electron/db";
import { Model, DataTypes } from "sequelize";
import { Organization } from "./organization";
import { User } from "./user";

export type OrganizationRoleAttributes = {
	organizationUserId?: number;
	organizationId: number;
	role: string;
	createdAt?: Date;
	updatedAt?: Date;
};


export class OrganizationRole extends Model<OrganizationRoleAttributes> implements OrganizationRoleAttributes {
	public organizationUserId!: number;
	public organizationId!: number;
	public role!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    organization?: Organization;
    user?: User;
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

OrganizationRole.hasOne(User, {
	foreignKey: "organizationRoleId",
	as: "user",
});

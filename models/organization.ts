import { DataTypes, INTEGER, STRING } from "sequelize";
import { Model } from "sequelize";
import { sequelize } from "../electron/db";
import { Address } from "./address";
import { OrganizationRole } from "./organization_role";

export type OrganizationAttributes = {
	organizationId?: number;
	name: string;
	phone?: string;
	address?: number;
	createdAt?: Date;
	updatedAt?: Date;
};

export class Organization extends Model<OrganizationAttributes> implements OrganizationAttributes {
	public organizationId!: number;
	public name!: string;
	public phone?: string;
	public address?: number;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

// export class Organization extends Model {
// 	public organizationId!: number;
// 	public name!: string;
// 	public phone?: string;
// 	public address?: number;
//     public readonly createdAt!: Date;
//     public readonly updatedAt!: Date;
// }

Organization.init(
	{
		organizationId: {
			type: INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: STRING,
			allowNull: false,
		},
		phone: {
			type: STRING,
			allowNull: true,
		},
		address: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
			references: {
				model: "addresses",
				key: "addressId",
			},
		},
	},
	{
		tableName: "organizations",
		sequelize,
        paranoid: true,
	}
);

Organization.belongsTo(Address, {
    foreignKey: "addressId",
    as: "address",
});

Organization.hasMany(OrganizationRole, {
    foreignKey: "organizationId",
    as: "roles",
});

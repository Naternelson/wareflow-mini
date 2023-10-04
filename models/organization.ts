import { DataTypes, INTEGER, STRING } from "sequelize";
import { Model } from "sequelize";
import { sequelize } from "../electron/db";
export class Organization extends Model {
	public organizationId!: number;
	public name!: string;
	public phone?: string;
	public address?: number;
}

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

// Organization.belongsTo(Address, {
//     foreignKey: "addressId",
//     as: "address",
//});

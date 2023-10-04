import { sequelize } from "../electron/db";

import { Model, DataTypes } from "sequelize";
import { Organization } from "./organization";

export class Product extends Model {
	public productId!: number;
	public name!: string;
	public description?: string;
	public organizationId!: number;
}

Product.init(
	{
		productId: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		organizationId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: "organizations",
				key: "organizationId",
			},
		},
	},
	{
		tableName: "products",
		sequelize,
        paranoid: true, 
	}
);

Product.belongsTo(Organization, {
    foreignKey: "organizationId",
})



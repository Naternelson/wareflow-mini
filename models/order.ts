import { DataTypes, Model } from "sequelize";
import { sequelize } from "../electron/db";
import { Organization } from "./organization";

export class Order extends Model {
    public orderId!: number;
    public organizationId!: number;
    public customerId!: number;
    public orderDate!: Date;
    public dueByDate?: Date;
    public shipToAddress?: number;
    public billToAddress?: number;

}

Order.init(
	{
		orderId: {
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
		customerId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: "customers",
				key: "customerId",
			},
		},
		orderDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		dueByDate: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		shipToAddress: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
			references: {
				model: "addresses",
				key: "addressId",
			},
		},
		billToAddress: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
			references: {
				model: "addresses",
				key: "addressId",
			},
		},
	},
	{
		tableName: "orders",
		sequelize,
        paranoid: true,
	}
);

Order.belongsTo(Organization, {
    foreignKey: "organizationId",
    as: "organization",
    onDelete: "CASCADE",
})
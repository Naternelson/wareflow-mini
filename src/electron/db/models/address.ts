import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { Organization } from "./organization";
import { sequelize } from "../db";
import { SanitizedAddress } from "../../../common/helpers";

export class Address extends Model<InferAttributes<Address>, InferCreationAttributes<Address>> {
	declare id: CreationOptional<number>;
	declare street?: string;
	declare street2?: string;
	declare city?: string;
	declare state?: string;
	declare zip?: string;
	declare readonly createdAt: CreationOptional<Date>;
	declare readonly updatedAt: CreationOptional<Date>;

	declare organizations: NonAttribute<Organization[]>;
	sanitize: () => SanitizedAddress = () => {
		return {
			id: this.id,
			street: this.street,
			street2: this.street2,
			city: this.city,
			state: this.state,
			zip: this.zip,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	};
}

Address.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		street: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		street2: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		city: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		state: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		zip: {
			type: DataTypes.STRING,
			allowNull: false,
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
		sequelize,
		modelName: "addresses",
		paranoid: true,
	}
);

Address.hasOne(Organization, {
	foreignKey: "addressId",
	as: "organization",
});

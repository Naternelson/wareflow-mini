import {
	CreationOptional,
	DataTypes,
	HasManyCreateAssociationMixin,
	InferAttributes,
	InferCreationAttributes,
	Model,
	NonAttribute,
} from "sequelize";
import { User } from "./user";
// import { Address } from "./address";
import { sequelize } from "../db";
import { BasicOrganization } from "../../../common/models/organization";

export class Organization extends Model<InferAttributes<Organization>, InferCreationAttributes<Organization>> {
	declare id: CreationOptional<number>;
	declare name: string;
	// declare addressId: ForeignKey<Address["id"]>;
	declare readonly createdAt: CreationOptional<Date>;
	declare readonly updatedAt: CreationOptional<Date>;

	declare users: NonAttribute<User[]>;
	// declare address: NonAttribute<Address>;

	// declare createAddress: BelongsToCreateAssociationMixin<Address>;
	declare createUser: HasManyCreateAssociationMixin<User>;
	findUserByPk = async (id: number) => {
		return await User.findOne({where: {id, organizationId: this.id}, include: ["organization"]})
	}
	sanitize = (): BasicOrganization => {
		return this.toJSON() 
	}
}

Organization.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		// addressId: {
		// 	type: DataTypes.INTEGER.UNSIGNED,
		// 	allowNull: false,
		// },
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
		paranoid: true,
	}
);



export const associateOrganization = () => {
Organization.hasMany(User, {
	foreignKey: "organizationId",
	as: "users",
	onDelete: "CASCADE",
});
};
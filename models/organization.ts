import { sequelize } from "../electron/db";
import { Address } from "./address";
import {
	Association,
	CreationOptional,
	DataTypes,
	ForeignKey,
	HasManyAddAssociationMixin,
	HasManyAddAssociationsMixin,
	HasManyCountAssociationsMixin,
	HasManyCreateAssociationMixin,
	HasManyGetAssociationsMixin,
	HasManyHasAssociationMixin,
	HasManyHasAssociationsMixin,
	HasManyRemoveAssociationMixin,
	HasManyRemoveAssociationsMixin,
	HasManySetAssociationsMixin,
	InferAttributes,
	InferCreationAttributes,
	Model,
	NonAttribute,
} from "sequelize";
import { User } from "./user";
import { Department } from "./department";

export class Organization extends Model<InferAttributes<Organization>, InferCreationAttributes<Organization>> {
	declare id: CreationOptional<number>;
	declare name: string;
	declare phone: string | null;
	declare addressId: ForeignKey<Address["id"]>;
	declare readonly createdAt: CreationOptional<Date>;
	declare readonly updatedAt: CreationOptional<Date>;

	declare address?: NonAttribute<Address>;

	// Has Many associations with Users
	declare createUser: HasManyCreateAssociationMixin<User, "organizationId">;
	declare addUser: HasManyAddAssociationMixin<User, number>;
	declare addUsers: HasManyAddAssociationsMixin<User, number>;
	declare getUsers: HasManyGetAssociationsMixin<User>;
	declare setUsers: HasManySetAssociationsMixin<User, number>;
	declare removeUser: HasManyRemoveAssociationMixin<User, number>;
	declare removeUsers: HasManyRemoveAssociationsMixin<User, number>;
	declare hasUser: HasManyHasAssociationMixin<User, number>;
	declare hasUsers: HasManyHasAssociationsMixin<User, number>;
	declare countUsers: HasManyCountAssociationsMixin;

	// Has Many associations with Departments
	declare createDepartment: HasManyCreateAssociationMixin<Department, "organizationId">;
	declare addDepartment: HasManyAddAssociationMixin<Department, number>;
	declare addDepartments: HasManyAddAssociationsMixin<Department, number>;
	declare getDepartments: HasManyGetAssociationsMixin<Department>;
	declare setDepartments: HasManySetAssociationsMixin<Department, number>;
	declare removeDepartment: HasManyRemoveAssociationMixin<Department, number>;
	declare removeDepartments: HasManyRemoveAssociationsMixin<Department, number>;
	declare hasDepartment: HasManyHasAssociationMixin<Department, number>;
	declare hasDepartments: HasManyHasAssociationsMixin<Department, number>;
	declare countDepartments: HasManyCountAssociationsMixin;

	declare users?: NonAttribute<User[]>;

	declare static associations: {
		address: Association<Organization, Address>;
		userRoles: Association<Organization, User>;
	};
	sanitize(){
		return {
			id: this.id,
			name: this.name,
			phone: this.phone,
			address: this.address?.sanitize(), 
		}
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
			unique: true,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{ tableName: "organizations", sequelize, paranoid: true }
);

Organization.hasMany(User, {
	foreignKey: "organizationId",
});


Organization.hasMany(Department, {
	foreignKey: "organizationId",
})
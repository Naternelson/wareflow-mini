import { CreationOptional, DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { Organization } from "./organization";
import { User } from "./user";
import { sequelize } from "../electron/db";

export class Department extends Model<InferAttributes<Department>, InferCreationAttributes<Department>> {
	declare id: CreationOptional<number>;
	declare name: string;
	declare description: string;
	declare organizationId: number;
	declare readonly createdAt: CreationOptional<Date>;
	declare readonly updatedAt: CreationOptional<Date>;

	declare organization?: NonAttribute<Organization>;

	// Has Many associations with Users
	declare users?: NonAttribute<User[]>;
	declare createUser: HasManyCreateAssociationMixin<User, "departmentId">;
	declare addUser: HasManyAddAssociationMixin<User, number>;
	declare addUsers: HasManyAddAssociationsMixin<User, number>;
	declare getUsers: HasManyGetAssociationsMixin<User>;
	declare setUsers: HasManySetAssociationsMixin<User, number>;
	declare removeUser: HasManyRemoveAssociationMixin<User, number>;
	declare removeUsers: HasManyRemoveAssociationsMixin<User, number>;
	declare hasUser: HasManyHasAssociationMixin<User, number>;
	declare hasUsers: HasManyHasAssociationsMixin<User, number>;
	declare countUsers: HasManyCountAssociationsMixin;

    sanitize(){
        return this.toJSON();
    }
}

Department.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        organizationId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: "department",
    }
);

Department.hasMany(User, {
    foreignKey: "departmentId",
    as: "users",
})

Department.belongsTo(Organization, {
    foreignKey: "organizationId",
    as: "organization",
})
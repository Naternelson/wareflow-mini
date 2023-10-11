import { sequelize } from "../electron/db";
import {
	Association,
	CreationOptional,
	DataTypes,
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
import { Organization } from "./organization";


export class Address extends Model<InferAttributes<Address>, InferCreationAttributes<Address>>{
    declare id: CreationOptional<number>;
    declare street: CreationOptional<string>;
    declare street2: CreationOptional<string>;
    declare city: CreationOptional<string>;
    declare state: CreationOptional<string>;
    declare zip: CreationOptional<string>;
    declare country: CreationOptional<string>;
    declare longitude: CreationOptional<string>;
    declare latitude: CreationOptional<string>;
    declare readonly createdAt: CreationOptional<Date>;
    declare readonly updatedAt: CreationOptional<Date>;

    // Has Many associations with Organizations
    declare createOrganization: HasManyCreateAssociationMixin<Organization, "addressId">;
    declare addOrganization: HasManyAddAssociationMixin<Organization, number>;
    declare addOrganizations: HasManyAddAssociationsMixin<Organization, number>;
    declare getOrganizations: HasManyGetAssociationsMixin<Organization>;
    declare setOrganizations: HasManySetAssociationsMixin<Organization, number>;
    declare removeOrganization: HasManyRemoveAssociationMixin<Organization, number>;
    declare removeOrganizations: HasManyRemoveAssociationsMixin<Organization, number>;
    declare hasOrganization: HasManyHasAssociationMixin<Organization, number>;
    declare hasOrganizations: HasManyHasAssociationsMixin<Organization, number>;
    declare countOrganizations: HasManyCountAssociationsMixin;

    declare organizations?: NonAttribute<Organization[]>;

    declare static associations: {
        organizations: Association<Address, Organization>;
    };

    sanitize(){
        return this.toJSON(); 
    }
}

Address.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
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
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        longitude: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        latitude: {
            type: DataTypes.STRING,
            allowNull: true,
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
        modelName: "Address",
        tableName: "addresses",
    }
);
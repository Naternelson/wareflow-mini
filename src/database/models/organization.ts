import { BelongsToCreateAssociationMixin, CreationOptional, DataTypes, ForeignKey, HasManyCreateAssociationMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { User } from "./user";
import { Address } from "./address";
import { sequelize } from "../db";
import { SanitizedOrganization } from "../../common/organization";

export class Organization extends Model<InferAttributes<Organization>, InferCreationAttributes<Organization>> {
	declare id: CreationOptional<number>;
    declare name: string;
    declare addressId: ForeignKey<Address["id"]>;
	declare readonly createdAt: CreationOptional<Date>;
	declare readonly updatedAt: CreationOptional<Date>;

	declare users: NonAttribute<User[]>;
    declare address: NonAttribute<Address>;

    declare createAddress: BelongsToCreateAssociationMixin<Address>;
    declare createUser: HasManyCreateAssociationMixin<User>;

    sanitize: () => SanitizedOrganization = () => {
        return {
            id: this.id,
            name: this.name,
            addressId: this.addressId,
            address: this.address.sanitize(),
        };
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
        addressId: {
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
        },
    },
    {
        sequelize: sequelize,
        tableName: "organizations",
        paranoid: true,
    }
);

Organization.hasMany(User, {
    foreignKey: "organizationId",
    as: "users",
    onDelete: "CASCADE",
});

Organization.belongsTo(Address, {
    foreignKey: "addressId",
    as: "address",
    onDelete: "CASCADE",
    });
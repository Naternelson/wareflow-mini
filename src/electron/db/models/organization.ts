import {
	CreateOptions,
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
import { BasicProduct } from "../../../common/models/product";
import { Product } from "./product";
import { BasicProductIdentifier } from "../../../common/models/product-identifier";
import { ProductIdentifier } from "./product_identifier";
import { CreationAttributes } from "../../../common";

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
	addProduct = async (data: {product: CreationAttributes<BasicProduct>, ids?: CreationAttributes<BasicProductIdentifier, "productId" | "organizationId">[]}, options?: CreateOptions) => {
		const {product, ids} = data
		const savedProduct = await Product.create({...product, organizationId: this.id}, options)
		const savedIds = ids ? await Promise.all(ids.map(async (id) => {
			return await ProductIdentifier.create({...id, productId: savedProduct.id, organizationId: this.id}, options)
		})) : []
		return {product:savedProduct, ids: savedIds}
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
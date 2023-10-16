import {
	CreationOptional,
	DataTypes,
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
	Model,
	NonAttribute,
	VirtualDataType,
} from "sequelize";
import { Organization } from "./organization";
import { sequelize } from "../db";
import { AuthToken, SanitizedUser, UserPermission } from "../../common/auth";
import { sign, verify } from "jsonwebtoken";
import bcrypt from "bcrypt";

const DefaultExpiry: string | number | undefined = "7d";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	static userPermissions = Object.values(UserPermission);
	static findByToken = async (token: string) => {
		const decoded = verify(token, process.env.JWT_SECRET as string) as AuthToken;
		const { authId, deleted } = decoded;
		if (!authId || !!deleted) return null;
		return User.findByPk(authId, { include: { all: true } });
	};

	declare id: CreationOptional<number>;
	declare firstName: string;
	declare lastName: string;
	declare lastLogin: CreationOptional<Date>;
	declare permission: UserPermission;
	declare email: string;
	declare passwordHashed: CreationOptional<string>;

	// virtual field of password
	declare password: string;

	declare readonly createdAt: CreationOptional<Date>;
	declare readonly updatedAt: CreationOptional<Date>;

	declare organizationId: ForeignKey<Organization["id"]>;
	declare organization?: NonAttribute<Organization>;

	sanitize: () => SanitizedUser = () => {
		return {
			id: this.id,
			firstName: this.firstName,
			lastName: this.lastName,
			email: this.email,
			permission: this.permission,
			lastLogin: this.lastLogin,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	};

	updateLastLogin = (commit: boolean = true, lastLoginDate: Date = new Date()) => {
		this.lastLogin = lastLoginDate;
		if (!!commit) return this.save();
		return this;
	};
	saveAndSignToken = async (expiry: typeof DefaultExpiry = DefaultExpiry) => {
		// Ensures that the user has an id before signing the token
		await this.save();
		return this.signToken(expiry);
	};
	comparePassword = (password: string) => {
		return bcrypt.compare(password, this.passwordHashed);
	};

	signToken = (expiry: typeof DefaultExpiry = DefaultExpiry) => {
		return sign(
			{
				authId: this.id,
				permission: this.permission,
				email: this.email,
				organizationId: this.organizationId,
				deleted: this.isSoftDeleted(),
			},
			process.env.JWT_SECRET as string,
			{ expiresIn: expiry }
		);
	};
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		password: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
			},
		},
		passwordHashed: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		permission: {
			type: DataTypes.ENUM,
			values: Object.values(UserPermission),
			allowNull: false,
			defaultValue: UserPermission.USER,
		},

		lastLogin: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		organizationId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: Organization,
				key: "id",
			},
		},
	},
	{
		sequelize,
		modelName: "users",
		paranoid: true,
		hooks: {
			beforeSave: (user) => {
				if (user.changed("password")) {
					const salt = bcrypt.genSaltSync(10);
					// Store hashed representation in the database
					user.passwordHashed = bcrypt.hashSync(user.password, salt);
				}
			},
		},
	}
);

//User should be deleted if the organization is deleted
User.belongsTo(Organization, {
	foreignKey: "organizationId",
	as: "organization",
	onDelete: "CASCADE",
});

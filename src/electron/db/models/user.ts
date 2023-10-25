import {
	CreationOptional,
	DataTypes,
	FindOptions,
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
	Model,
	NonAttribute,
} from "sequelize";
import { Organization } from "./organization";
import { sequelize } from "../db";
import { TokenExpiredError, sign, verify } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { cleanStringFieldsHooks } from "./utils/cleanStringFields";
import { TokenExpiredError as ApiTokenExpired, UnauthorizedError } from "../../../common";
import { AuthToken, BasicUser, UserPermission } from "../../../common/models";
import { LoginLog } from "./login_log";

const DefaultExpiry: string | number | undefined = "7d";
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	static userPermissions = Object.values(UserPermission);
	static emailPattern = /^\S+@\S+\.\S+$/;
	static passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+,-./:;<=>?@[\]^`{|}~]{8,}$/;
	static emailExists = async (email: string, organizationId: number) => {
		const user = await User.findOne({ where: { email, organizationId } });
		return !user;
	};
	static decodeToken = (token: string) => {
		try {
			return verify(token, process.env.JWT_SECRET as string) as AuthToken;
		} catch (error) {
			if (error instanceof TokenExpiredError) throw new ApiTokenExpired("Token expired");
			throw new UnauthorizedError("Invalid token");
		}
	};
	static findByToken = async (token: string, options?:FindOptions) => {
		const decoded = this.decodeToken(token);
		const { userId, deleted } = decoded;
		if (!userId || !!deleted) return null;
		return User.findByPk(userId, options);
	};

	declare id: CreationOptional<number>;
	declare firstName: string;
	declare lastName: string;
	declare permission: UserPermission;
	declare email: string;
	declare passwordHashed: CreationOptional<string>;

	// virtual field of password
	declare password: string;

	declare readonly createdAt: CreationOptional<Date>;
	declare readonly updatedAt: CreationOptional<Date>;

	declare organizationId: ForeignKey<Organization["id"]>;
	declare organization?: NonAttribute<Organization>;

	logLogin = (outcome: LoginLog["outcome"]) => {
		try {
			LoginLog.create({
				userId: this.id,
				outcome,
			});
		} catch {
			console.log("Error logging login");
		}
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
		const tokenInformation: AuthToken = {
			userId: this.id,
			permission: this.permission,
			organizationId: this.organizationId,
			deleted: this.isSoftDeleted(),
		};
		return sign(tokenInformation, process.env.JWT_SECRET as string, { expiresIn: expiry });
	};
	sanitize = (): BasicUser => {
		const { password, passwordHashed, ...safeProps } = this.toJSON();
		return {
			id: safeProps.id,
			firstName: safeProps.firstName,
			lastName: safeProps.lastName,
			permission: safeProps.permission,
			email: safeProps.email,
			createdAt: safeProps.createdAt,
			updatedAt: safeProps.updatedAt,
			organizationId: safeProps.organizationId,
		};
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
				is: User.passwordPattern,
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
			defaultValue: UserPermission.Guest,
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
		paranoid: true,
		indexes: [
			{
				fields: ["email", "organizationId"],
				unique: true,
			},
		],
		hooks: {
			beforeSave: async (user) => {
				if (user.changed("password")) {
					const salt = bcrypt.genSaltSync(10);
					// Store hashed representation in the database
					user.passwordHashed = await bcrypt.hash(user.password, salt);
				}
			},
			...cleanStringFieldsHooks<User>("firstName", "lastName", "email"),
		},
	}
);
export const associateUser = () => {
	//User should be deleted if the organization is deleted
	User.belongsTo(Organization, {
		foreignKey: "organizationId",
		as: "organization",
		onDelete: "CASCADE",
	});

	User.hasMany(LoginLog, {
		foreignKey: "userId",
		as: "loginLogs",
		onDelete: "CASCADE",
	});
};

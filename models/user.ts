// /models/user.ts

import {
	Association,
	CreationOptional,
	DataTypes,
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
	Model,
	NonAttribute,
} from "sequelize";
import { Organization } from "./organization";
import { Department } from "./department";
import { sequelize } from "../electron/db";
import bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";

export enum AccessScope {
	ADMIN = "admin",
	USER = "user",
	GUEST = "guest",
	SUPERADMIN = "superadmin",
}

export interface AuthToken {
	id: number;
	organizationId: number;
	accessScope?: AccessScope;
}

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: CreationOptional<number>;
	declare firstName?: string;
	declare lastName?: string;
	declare displayName: string | null;
	declare photoURL: string | null;
	declare email: string;
	declare password: string;
	declare passwordHash?: string;
	declare organizationId: ForeignKey<Organization["id"]>;
	declare departmentId: ForeignKey<Department["id"]>;
	declare accessScope: AccessScope;
	declare lastLogin: CreationOptional<Date>;
	declare readonly createdAt: CreationOptional<Date>;
	declare readonly updatedAt: CreationOptional<Date>;

	declare organization?: NonAttribute<Organization>;
	declare department?: NonAttribute<Department>;

	declare static associations: {
		organization: Association<User, Organization>;
		department: Association<User, Department>;
	};

	static decodeAuthToken(token: string): AuthToken | null {
		const decoded = verify(token, process.env.JWT_SECRET as string) as AuthToken;
		const {id, organizationId, accessScope} = decoded;
		if(!id || !organizationId) return null 
		return {
			id,
			organizationId,
			accessScope,
		}
	}
	static findByToken(token: string): Promise<User | null> {
		const decoded = User.decodeAuthToken(token);
		if(!decoded) return Promise.resolve(null);
		return User.findByPk(decoded.id);
	}
	generateAuthToken(): string {
		const token: AuthToken = {
			id: this.id,
			organizationId: this.organizationId,
			accessScope: this.accessScope,
		};
		return sign(token, process.env.JWT_SECRET as string, { expiresIn: "7d" });
	}
	
	updateLastLogin(preventSave?: boolean) {
		this.lastLogin = new Date();
		if (preventSave) return Promise.resolve(this);
		return this.save();
	}
	sanitize() {
		return {
			id: this.id,
			firstName: this.firstName,
			lastName: this.lastName,
			displayName: this.displayName,
			photoURL: this.photoURL,
			email: this.email,
			organizationId: this.organizationId,
			departmentId: this.departmentId,
			accessScope: this.accessScope,
			lastLogin: this.lastLogin,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}
	validatePassword(password: string) {
		if (!this.passwordHash) throw new Error("Password hash is not set");
		return bcrypt.compare(password, this.passwordHash);
	}
	validatePasswordFormat(password: string) {
		const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,50}$/;
		return re.test(password);
	}
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		displayName: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		photoURL: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				isUrl: true,
			},
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
				is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,50}$/,
			},
		},
		passwordHash: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		organizationId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: "organizations",
				key: "organizationId",
			},
		},
		departmentId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
			references: {
				model: "departments",
				key: "id",
			},
		},
		accessScope: {
			type: DataTypes.ENUM(...Object.values(AccessScope)),
			allowNull: true,
		},
		lastLogin: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{
		tableName: "users",
		sequelize,
		paranoid: true,
		hooks: {
			beforeSave: async (user) => {
				if (user.changed("password")) {
					const passwordHash = await bcrypt.hash(user.password, 10);
					user.passwordHash = passwordHash;
				}
			},
			beforeCreate: async (user) => {
				if (user.getDataValue("departmentId")) {
					const department = await Department.findByPk(user.getDataValue("departmentId"));
					if (department && department.getDataValue("organizationId")) {
						user.setDataValue("organizationId", department.getDataValue("organizationId"));
					}
				}
			},
		},
	}
);

User.belongsTo(Organization, {
	foreignKey: "organizationId",
	as: "organization",
});

User.belongsTo(Department, {
	foreignKey: "departmentId",
	as: "department",
});
if (!process.env.JWT_SECRET) {
	throw new Error("JWT_SECRET is not set in the environment variables");
}

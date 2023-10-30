import { BasicOrganization } from "./organization";

export enum UserPermission {
    Admin = "admin",
    User = "user",
    Guest = "guest",
    SuperAdmin = "super_admin",
}

export interface AuthToken {
    userId: number;
    organizationId: number;
    permission: UserPermission;
    deleted: boolean;
}

export type BasicUser = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    permission: UserPermission;
    organizationId: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface AuthResponse {
	data: {
		token: string;
		user: BasicUser;
		organization: BasicOrganization;
	};
}

export interface SigninUserBody {
    email: string;
    password: string;
    organizationId: number | null
}

export interface SigninTokenBody {}

export interface UpdateUserBody {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
}

export interface CreateUserBody {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organizationId: number;
    permission: UserPermission;
}
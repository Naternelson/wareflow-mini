import { SanitizedOrganization } from "./organization";

export enum UserPermission {
	ACCOUNT_MANAGER = "account_manager",
	ADMIN = "admin",
	USER = "user",
	SUPER_ADMIN = "super_admin",
}

export enum AuthHandler {
	USER_SIGNIN = "USER_SIGNIN",
    USER_REFRESH = "USER_REFRESH",
    USER_SIGNUP_WITH_ORGANIZATION = "USER_SIGNUP_WITH_ORGANIZATION",
}

export interface UserSigninRequest {
	email: string;
	password: string;
}

export type UserSignupWithOrganizationRequest =  Partial<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organizationName: string;
    street: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
}>

export interface UserRefreshRequest {
    token: string;
}

export type SanitizedUser = Partial<{
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	permission: UserPermission;
	lastLogin: Date;
	createdAt: Date;
	updatedAt: Date;
}>;

export interface UserSigninResponse {
	token: string;
	user: SanitizedUser;
	organization: SanitizedOrganization
}

export interface AuthToken {
    authId?: number;
    permission?: UserPermission;
    email?: string;
    organizationId?: number;
    deleted?: boolean;
}
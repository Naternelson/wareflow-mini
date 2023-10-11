import { compareSync } from "bcrypt";
import { Organization } from "../../models/organization";
import { Department } from "../../models/department";
import { AccessScope, User } from "../../models/user";

export const isEmail = (email: string) => {
	const re = /\S+@\S+\.\S+/;
	return re.test(email);
};

export const validPasswordType = (password: string) => {
	const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
	return re.test(password);
};

export const validatePassword = (password: string, hash: string) => {
	return compareSync(password, hash);
};

export const USER_INCLUDE = {
	include: [
		{
			model: Organization,
			as: "organization",
		},
		{
			model: Department,
			as: "department",
		},
	],
};

/**
 * Utility function to check if a user has the right authorization based on their role and ownership.
 * 
 * @param {User} user - The user object from the database.
 * @param {string} [authToken] - Decoded JWT token containing user's authorization details.
 * 
 * @returns {boolean} - Returns true if the user is authorized, false otherwise.
 */
export const isAuthorized = (user: User, authToken?: string): boolean => {
	// Basic checks
	if (!user.id || !authToken) return false;

	// Decode the token
	const { id: userId, organizationId, accessScope } = User.decodeAuthToken(authToken) || {};
	if (!userId) return false;

	// Authorization rules
	if (userId === user.id) return true; // Users can modify themselves
	if (accessScope === AccessScope.SUPERADMIN) return true; // Superadmin has all access
	if (accessScope === AccessScope.ADMIN && organizationId === user.organizationId) return true; // Admins can modify users in their organization

	return false;
};

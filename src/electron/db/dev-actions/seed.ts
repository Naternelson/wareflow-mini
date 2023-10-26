import { Transaction } from "sequelize";
import { UserPermission } from "../../../common";
import { sequelize } from "../db";
import { Organization, User } from "../models";

export const SeedDb = async () => {
	let transaction: Transaction | null = null;
	try {
		transaction = await sequelize.transaction();
		const organization = await Organization.create(
			{
				name: "Super Admin Organization",
			},
			{ transaction }
		);
		const user = await User.create(
			{
				firstName: "Nathan",
				lastName: "Nelson",
				email: "email@email.com",
				password: "Password1234!",
				permission: UserPermission.SuperAdmin,
				organizationId: organization.id,
			},
			{ transaction }
		);
		await transaction.commit();
		console.log("Created user", user.sanitize());
	} catch (e: any) {
		transaction && (await transaction.rollback());
		console.error("Failed to seed db", e?.message);
	}
};

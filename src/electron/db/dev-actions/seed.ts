import { Transaction } from "sequelize";
import { UserPermission } from "../../../common";
import { sequelize } from "../db";
import { Organization, User } from "../models";
import { ProductIdentifierType } from "../../../common/models/product-identifier";

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

		const productOne = organization.addProduct(
			{
				product: {
					name: "Product One",
					description: "Product One Description",
					unit: "unit",
				},
				ids: [
					{
						name: "SKU",
						value: "123456789",
						primary: true,
						type: ProductIdentifierType.SKU,
					},
					{
						name: "UPC",
						value: "123456789",
						primary: false,
						type: ProductIdentifierType.UPC,
					},
				],
			},
			{ transaction }
		);
		const productTwo = organization.addProduct(
			{
				product: {
					name: "Product Two",
					description: "Product Two Description",
					unit: "unit",
				},
				ids: [
					{
						name: "SKU",
						value: "987654321",
						primary: true,
						type: ProductIdentifierType.SKU,
					},
					{
						name: "UPC",
						value: "126459789",
						primary: false,
						type: ProductIdentifierType.UPC,
					},
				],
			},
			{ transaction }
		);
		await Promise.all([productOne, productTwo]);

		await transaction.commit();
		console.log("Created user", user.sanitize());
	} catch (e: any) {
		transaction && (await transaction.rollback());
		console.error("Failed to seed db", e?.message);
	}
};

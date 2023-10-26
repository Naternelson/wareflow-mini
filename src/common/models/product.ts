import { ProductIdentifier } from "../../electron/db/models";

export interface BasicProduct {
	id: number;
	name: string;
	unit: string;
	createdAt: Date;
	updatedAt: Date;
}

export type ProductResponse = Partial<{
	product: Partial<ProductResponse>;
	primaryIdentifiers: Partial<ProductIdentifier>;
	secondaryIdentifiers: Partial<ProductIdentifier>[];
}>;

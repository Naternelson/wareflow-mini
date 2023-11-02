import { ProductIdentifier } from "../../electron/db/models";
import { BasicProductIdentifier } from "./product-identifier";
import { BasicProductSpec } from "./product_spec";

export interface BasicProduct {
	id: number;
	name: string;
	unit: string;
	createdAt: Date;
	updatedAt: Date;
}

export type ProductResponse = Partial<{
	data: Partial<BasicProduct>;
	specs: Partial<BasicProductSpec>[];
	ids: number[];
	secondaryIds: Record<number, BasicProductIdentifier>;
}>;

export type ProductListResponse = {
	products: Record<number, ProductResponse>;
	ids: number[];
	secondaryIds: Record<number, BasicProductIdentifier[]>;
};

export type ProductRequestBody = {
	organizationId?: number,
	productId?: number | number[];
	search?: string;
	limit?: number;
	offset?: number;
	orderBy?: {
		[name: string]: "ASC" | "DESC";
	},
};


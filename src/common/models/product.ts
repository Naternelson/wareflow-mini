import { ProductIdentifier } from "../../electron/db/models";
import { BasicModel } from "../type_helpers";
import { BasicProductIdentifier } from "./product-identifier";
import { BasicProductSpec } from "./product_spec";

export type BasicProduct = BasicModel &{
	name: string;
	description: string;
	unit: string;
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


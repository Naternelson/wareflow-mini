import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface Product {
	id: string;
	name: string;
	description: string;
	itemProperties: {
		id: string;
		regex?: string;
		defaultValue?: string;
		options?: string[];
		required?: boolean;
		unique?: boolean;
		type: "string" | "number" | "boolean" | "date";
	}[];
	standardBinSize?: number;
	onBinLabel?: string; 
	customerName: string | null;
	createdDate: string;
	updatedDate: string;

}

export interface ProductsState {
	[productId: string]: Product;
}

const initialState: ProductsState = {};

const slice = createSlice({
	name: "products",
	initialState,
	reducers: {
		upsertProducts: (state, action: PayloadAction<ProductsState>) => {
			Object.assign(state, action.payload);
		},

		deleteProducts: (state, action: PayloadAction<string[]>) => {
			action.payload.forEach((productId) => {
				delete state[productId];
			});
		},
		resetProducts: () => initialState,
	},
});

export const { upsertProducts, deleteProducts, resetProducts } = slice.actions;
export const productsReducer = slice.reducer;

export const getProductById = (productId?: string) => (state: ProductsState) =>
	productId ? state[productId] : undefined;

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ProductItem {
	productId: string;
	properties: {
		[propertyId: string]: string; // Lookup product item properties
	};
	binId: string | null;
	quantity: number; // May be grouped by product item properties, default is one
	printed?: boolean;
}

export interface ProductItemsState {
	[productItemId: string]: ProductItem;
}
const initialState: ProductItemsState = {};

const slice = createSlice({
	name: "productItems",
	initialState,
	reducers: {
		upsertProductItems: (state, action: PayloadAction<ProductItemsState>) => {
			Object.assign(state, action.payload);
		},
		deleteProductItems: (state, action: PayloadAction<string[]>) => {
			action.payload.forEach((productItemId) => {
				delete state[productItemId];
			});
		},
		resetProductItems: () => initialState,
		updateProductItemProperty: (
			state,
			action: PayloadAction<{ productItemId: string; propertyId: string; value: string }>
		) => {
			const productItem = state[action.payload.productItemId];
			if (productItem) {
				productItem.properties[action.payload.propertyId] = action.payload.value;
			}
		},
		deleteProductItemProperty: (state, action: PayloadAction<{ productItemId: string; propertyId: string }>) => {
			const productItem = state[action.payload.productItemId];
			if (productItem) {
				delete productItem.properties[action.payload.propertyId];
			}
		},
		updateItemPrinted: (state, action: PayloadAction<{ productItemId: string; printed: boolean }>) => {
			const productItem = state[action.payload.productItemId];
			if (productItem) {
				productItem.printed = action.payload.printed;
			}
		},
	},
});

export const {
	upsertProductItems,
	deleteProductItems,
	resetProductItems,
	updateProductItemProperty,
	deleteProductItemProperty,
} = slice.actions;
export const productItemsReducer = slice.reducer;

export const getProductItemById = (productItemId: string) => (state: ProductItemsState) => state[productItemId];

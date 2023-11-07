import { createSlice } from "@reduxjs/toolkit";
import { ProductListResponse, ProductRequestBody } from "../../../common/models/product";
import { DeepDateToString } from "../../../common/type_helpers";
import { createApiThunk } from "../utils";

type ProductsState = {
    status: "idle" | "loading" | "success" | "error";
    productIds: DeepDateToString<ProductListResponse["ids"]>
    secondaryProductIds: DeepDateToString<ProductListResponse["secondaryIds"]>
    error: string | null;
    products: DeepDateToString<ProductListResponse["products"]>
}
const initialState: ProductsState = {
    status: "idle",
    productIds: [],
    secondaryProductIds: [],
    error: null,
    products: {}
}

export const getProducts = createApiThunk<ProductRequestBody>("products/getProducts")

const productsSlice = createSlice({
    name: "products",
    initialState, 
    reducers: {
        reset: () => {
            return initialState
        },
        productIdle: (state) => {
            state.status = "idle";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, pendingReducer)
            .addCase(getProducts.fulfilled, fulfilledProductsReducer)
            .addCase(getProducts.rejected, rejectedReducer)
    }
})

export const productsReducer = productsSlice.reducer;
export const { reset, productIdle } = productsSlice.actions;

const pendingReducer = (state: ProductsState) => {
    state.status = "loading";
}

const rejectedReducer = (state: ProductsState, action: any) => {
    state.status = "error";
    state.error = action.payload?.message || "Failed to get products";
}

const fulfilledProductsReducer = (state: ProductsState, action: any) => {
    const data = action.payload;
    state.status = "success";
    state.productIds = data.ids;
    state.secondaryProductIds = data.secondaryIds;
    state.products = data.products;
}
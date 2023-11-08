import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./auth";
import { ordersReducer } from "./orders";
import { productsReducer } from "./products";

export const reducers = combineReducers({
    auth: authReducer,
    orders: ordersReducer,
    products: productsReducer,
})

export type RootState = ReturnType<typeof reducers>

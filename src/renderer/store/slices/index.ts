import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./auth";
import { ordersReducer } from "./orders";

export const reducers = combineReducers({
    auth: authReducer,
    orders: ordersReducer
})

export type RootState = ReturnType<typeof reducers>

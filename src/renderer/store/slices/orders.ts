import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {  NewOrderRequestBody, OrderRequestBody, SerializedOrderListResponse, SerializedOrderResponse } from "../../../common";
import { createApiThunk } from "../utils";


type OrdersState = {
    status: "idle" | "loading" | "success" | "error";
    orderIds: SerializedOrderListResponse["ids"]
    secondaryOrderIds: SerializedOrderListResponse["secondaryIds"]
    error: string | null;
    orders: SerializedOrderListResponse["orders"]
}

const initialState: OrdersState = {
    status: "idle",
    orderIds: [],
    secondaryOrderIds: [],
    error: null,
    orders: {}
}

export const getOrders = createApiThunk<OrderRequestBody>("orders/getOrders")
export const newOrder = createApiThunk<NewOrderRequestBody>("orders/newOrder")
export const getOrder = createApiThunk<{orderId: number}>("orders/getOrder")

export const ordersSlice = createSlice({
    name: "orders",
    initialState, 
    reducers: {
        resetOrders: () => {
            return initialState
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOrders.pending, pendingReducer)
            .addCase(getOrders.fulfilled, fulfilledOrdersReducer)
            .addCase(getOrders.rejected, rejectedReducer)
            .addCase(newOrder.pending, pendingReducer)
            .addCase(newOrder.fulfilled, fulfullOrderReducer)
            .addCase(newOrder.rejected, rejectedReducer)
            .addCase(getOrder.pending, pendingReducer)
            .addCase(getOrder.fulfilled, fulfullOrderReducer)
            .addCase(getOrder.rejected, rejectedReducer)
    }
})

export const ordersReducer = ordersSlice.reducer;
export const { resetOrders } = ordersSlice.actions;

const pendingReducer = (state: OrdersState) => {
    state.status = "loading";
}
const rejectedReducer = (state: OrdersState, action: PayloadAction<any>) => {
    state.status = "error";
    state.error = action.payload.message || "Failed to get orders";
}

const fulfilledOrdersReducer = (state: OrdersState, action: PayloadAction<SerializedOrderListResponse>) => {
	const data = action.payload;
	state.status = "success";
	state.orderIds = action.payload.ids;
	state.error = null;
	state.orders = data.orders;
	state.secondaryOrderIds = data.secondaryIds;
};


const fulfullOrderReducer = (state: OrdersState, action: PayloadAction<SerializedOrderResponse>) => {
    const data = action.payload;
    state.status = "success";
    state.error = null;
    const id = data.data?.id;
    if(!id) return;
    state.orders[id] = data;
    if(!state.orderIds.includes(id)) state.orderIds.push(id);
    else state.orderIds.push(id) 
    state.secondaryOrderIds[id] = data.secondaryIds;

}


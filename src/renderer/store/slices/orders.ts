import { createSlice } from "@reduxjs/toolkit";
import { DToS } from "../../../common/type_helpers";
import { BasicOrderIdentifier } from "../../../common/models/order-identifier";
import { BasicOrder, BasicOrderItem } from "../../../common";

type OrdersState = {
    status: "idle" | "loading" | "success" | "error";
    orderIds: number[];
    secondaryOrderIds: { [id: number]: DToS<BasicOrderIdentifier>[]}
    error: string | null;
    orders: { [id: number]: {data: DToS<BasicOrder>, items: DToS<BasicOrderItem>, seondaryIds: DToS<BasicOrderIdentifier>[]} };
}

const initialState: OrdersState = {
    status: "idle",
    orderIds: [],
    secondaryOrderIds: [],
    error: null,
    orders: {}
}

const getOrders

export const ordersSlice = createSlice({
    name: "orders",
    initialState, 
    reducers: {
        clearOrders: () => {
            return initialState
        }
    }
})
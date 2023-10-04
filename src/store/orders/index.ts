import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Order {
	orderId: string;
	orderDate: string;
	orderTotal: number;
	orderStatus: "queued" | "in-progress" | "paused" | "completed" | "canceled";
	productId: string;
	orderCount: number;
	createdDate: string, 
	updatedDate: string 
}

export interface OrdersState {
	[orderId: string]: Order;
}

const initialState: OrdersState = {};

const slice = createSlice({
	name: "orders",
	initialState,
	reducers: {
		decrementOrderCount: (state, action: PayloadAction<{ orderId: string; decrementBy?: number }>) => {
			const order = state[action.payload.orderId];
			if (order) {
				order.orderCount -= action.payload.decrementBy || 1;
				order.updatedDate = new Date().toISOString();
			}
		},
		deleteOrders: (state, action: PayloadAction<string[]>) => {
			action.payload.forEach((orderId) => {
				delete state[orderId];
			});
		},
		incrementOrderCount: (state, action: PayloadAction<{ orderId: string; incrementBy?: number }>) => {
			const order = state[action.payload.orderId];
			if (order) {
				order.orderCount += action.payload.incrementBy || 1;
				order.updatedDate = new Date().toISOString();
			}
		},
		resetOrders: () => initialState,
		updateOrderStatus: (state, action: PayloadAction<{ orderId: string; orderStatus: Order["orderStatus"] }>) => {
			const order = state[action.payload.orderId];
			if (order) {
				order.orderStatus = action.payload.orderStatus;
			}
		},
		upsertOrders: (state, action: PayloadAction<OrdersState>) => {
			Object.assign(state, action.payload);
		},
	},
});

export const { decrementOrderCount, deleteOrders, incrementOrderCount, resetOrders, updateOrderStatus, upsertOrders } =
	slice.actions;

export const ordersReducer = slice.reducer;

export const getOrderById = (orderId?: string) => (state: OrdersState) => orderId ? state[orderId] : undefined;

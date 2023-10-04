import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./root";
import { ordersReducer } from "./orders";
import { productsReducer } from "./products";
import { productItemsReducer } from "./product_items";
import { binsReducer } from "./bins";
import { seedData } from "./seed";

const isDev = process.env.NODE_ENV === "development";

const store = configureStore({
	preloadedState: isDev ? seedData : undefined,
	reducer: { root: rootReducer, orders: ordersReducer, products: productsReducer, productItems: productItemsReducer, bins: binsReducer },
});

export type AppState = ReturnType<typeof store.getState>;
export default store;

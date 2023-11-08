import { configureStore } from "@reduxjs/toolkit";

import dateSerializerMiddleware from "./middleware/date_serialize";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { reducers } from "./slices";

const persistConfig = {
	key: "root",
	storage,
	whitelist: ["auth"],
};
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dateSerializerMiddleware),
});
export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;

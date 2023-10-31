import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { authReducer } from './slices/auth'
import dateSerializerMiddleware from './middleware/date_serialize'
import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const rootReducer = combineReducers({
    auth: authReducer
})


const persistConfig = {
    key: "root",
    storage, 
    whitelist: ["auth"]
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dateSerializerMiddleware),
});
export const persistor = persistStore(store)
export type AppDispatch = typeof store.dispatch
import { Middleware, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../slices";

const dateSerializerMiddleware: Middleware<{}, RootState> = (store) => (next) => (action: PayloadAction<any>) => {
	const serializeDates = (obj: Record<string, any>): Record<string, any> => {
		const result: Record<string, any> = {};
		for (const key in obj) {
			if (obj[key] instanceof Date) {
				result[key] = obj[key].toISOString();
			} else if (typeof obj[key] === "object" && obj[key] !== null) {
				result[key] = serializeDates(obj[key]);
			} else {
				result[key] = obj[key];
			}
		}
		return result;
	};

	const newAction = action.payload
		? {
				...action,
				payload: serializeDates({ ...action.payload }),
		  }
		: action;

	return next(newAction);
};

export default dateSerializerMiddleware;

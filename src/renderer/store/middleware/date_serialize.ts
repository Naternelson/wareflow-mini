import { Middleware, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../slices";

const dateSerializerMiddleware: Middleware<{}, RootState> = (store) => (next) => (action: PayloadAction<any>) => {
	const serializeDates = (value: any): any => {
		if (value instanceof Date) {
			return value.toISOString();
		} else if (Array.isArray(value)) {
			return value.map((item) => serializeDates(item));
		} else if (typeof value === "object" && value !== null) {
			return Object.keys(value).reduce((acc, key) => {
				acc[key] = serializeDates(value[key]);
				return acc;
			}, {} as any);
		} else {
			return value;
		}
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

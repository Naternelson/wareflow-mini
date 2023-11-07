import dayjs from "dayjs"
export type DeepDateToString<T> = {
	[K in keyof T]: T[K] extends Date
		? string
		: T[K] extends Array<infer U>
		? Array<DeepDateToString<U>>
		: T[K] extends object
		? DeepDateToString<T[K]>
		: T[K];
};

export type DToS<T> = DeepDateToString<T>;


export type DeepDayJs<T> = {
	[K in keyof T]: T[K] extends Date
		? dayjs.Dayjs
		: T[K] extends Array<infer U>
		? Array<DeepDayJs<U>>
		: T[K] extends object
		? DeepDayJs<T[K]>
		: T[K];
};

export type BasicModel = {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	deletedAt?: Date;
}

export type CreationAttributes<T extends Record<any, unknown>, B extends string = ""> = Omit<T, keyof BasicModel | B> 
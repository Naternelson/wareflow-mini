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

import { BackendRequest, BackendResponse, ErrorCodes } from "../../utility";

export const malformedRequest = <T extends typeof BackendRequest<any, any>>(expectedModel: T) => {
	const em = new expectedModel({} as any);

	return new BackendResponse(null, em.meta, "ERROR", {
		code: ErrorCodes.MALFORMED_REQUEST,
		message: `Expected request of type ${expectedModel.name}, but received unknown}`,
	});
};


export const permitFields = <T extends object>(obj: T, permittedFields: (keyof T)[]): Partial<T> => {
    return permittedFields.reduce<Partial<T>>((acc, field) => {
        acc[field] = obj[field];
        return acc;
    }, {} as Partial<T>);
};
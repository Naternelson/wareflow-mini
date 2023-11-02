import { BadRequestError } from "../../common";

export const validateField = (field: any, type: "integer" | "string" | "date" | "boolean" | Array<string>, name: string, allowUndefined:boolean=false) => {
	if (type === "integer" && Number.isInteger(field)) return field;
	if (type === "string" && typeof field === "string") return field.trim().replace(/\s+/g, " ");
	if (type === "date" && field instanceof Date) return field;
    if (Array.isArray(type) && type.includes(field)) return field;
    if(type === "boolean" && typeof field === "boolean") return field;
    if(allowUndefined) return undefined;
	throw new BadRequestError(`Invalid ${type} for ${name}`);
};

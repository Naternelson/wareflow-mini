import { Model } from "sequelize";
import {cleanString} from "../../../utils"

export const cleanStringFields = <T extends Model>(fields: Array<keyof T>) => (instance: T) => {
    fields.forEach(field => {
        if (instance[field]) {
            const value = instance[field];
            if (typeof value === "string")
                instance[field] = cleanString(value) as T[typeof field]
        }
    })
}

export const cleanStringFieldsHooks = <T extends Model>(...fields: Array<keyof T>) => {
    return {
        beforeCreate: cleanStringFields(fields),
        beforeUpdate: cleanStringFields(fields),
    }
}
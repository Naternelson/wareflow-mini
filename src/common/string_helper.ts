
export const toCamelCase = (str:string) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/[\s-]+/g, '');
};

export const toTitleCase = (str:string) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return word.toUpperCase();
    }).replace(/[\s-]+/g, '');
};
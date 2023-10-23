/**
 * Transforms camelCase string into UPPER_SNAKE_CASE.
 */
export const toUpperSnake = (str: string, append?: string): string => {
	return str.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase() + (append ? `_${append.toUpperCase()}` : "");
};

/**
 * Transforms camelCase string into lower_snake_case.
 */
export const toLowerSnake = (str: string, append?: string): string => {
	return str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase() + (append ? `_${append.toLowerCase()}` : "");
};

/**
 * Transforms string into camelCase.
 */
export const toCamelCase = (str: string, append?: string): string => {
	let result = str.replace(/([-_][a-z])/gi, ($1) => {
		return $1.charAt(1).toUpperCase();
	});
	if (append) {
		result += append.charAt(0).toLowerCase() + append.slice(1);
	}
	return result;
};

/**
 * Transforms string into PascalCase.
 */
export const toPascalCase = (str: string, append?: string): string => {
	let result = str.replace(/([-_]?[a-z])/gi, ($1) => {
		return $1.charAt($1.length - 1).toUpperCase();
	});
	if (append) {
		result += append.charAt(0).toUpperCase() + append.slice(1);
	}
	return result;
};

/**
 * Transforms string into kebab-case.
 */
export const toKebabCase = (str: string, append?: string): string => {
	return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() + (append ? `-${append.toLowerCase()}` : "");
};

/**
 * Transforms string into Title Case.
 */
export const toTitleCase = (str: string, append?: string): string => {
	let result = str.replace(/\w\S*/g, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
	if (append) {
		result += " " + append.charAt(0).toUpperCase() + append.slice(1);
	}
	return result;
};

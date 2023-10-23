export enum ErrorCodes {
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	METHOD_NOT_ALLOWED = 405,
	NOT_ACCEPTABLE = 406,
	PROXY_AUTHENTICATION_REQUIRED = 407,
	CONFLICT = 409,
	GONE = 410,
	PRECONDITION_FAILED = 412,
	UNPROCESSABLE_ENTITY = 422,
	TOO_MANY_REQUESTS = 429,
	TOKEN_EXPIRED = 498,
	INTERNAL_SERVER_ERROR = 500,
	BAD_GATEWAY = 502,
	SERVICE_UNAVAILABLE = 503,
	GATEWAY_TIMEOUT = 504,
}

// Define a Predicate type that is a function taking a value of type T and a key of type string,
// and returns a boolean. This function will be used to determine if a field is "missing."
type Predicate<T> = (value: T, key: string) => boolean;

/**
 * Finds missing fields in an object based on a predicate function.
 *
 * @param {T} object - The object to inspect for missing fields.
 * @param {Predicate<any>} [predicate] - An optional function to determine if a field is missing.
 *                                       The default predicate checks for undefined, null, or empty string values.
 *
 * @returns {string[]} - An array of keys that are considered "missing" according to the predicate.
 */
export const findMissingFields = <T extends Record<string, any>>(
  object: T,
  predicate: Predicate<any> = (value) => value === undefined || value === null || value === ""
): string[] => {
  // Initialize an array to hold the keys of missing fields.
  const missingFields: string[] = [];

  // Iterate over the object's entries (key-value pairs).
  for (const [key, value] of Object.entries(object)) {
    // If the predicate function returns true for this entry, add the key to the list of missing fields.
    if (predicate(value, key)) {
      missingFields.push(key);
    }
  }

  // Return the list of missing field keys.
  return missingFields;
};

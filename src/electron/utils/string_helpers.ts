/**
 * Return a string that has extra spaces removed and is trimmed.
 */
export function cleanString(str: string) {
    return str.replace(/\s+/g, " ").trim();
}

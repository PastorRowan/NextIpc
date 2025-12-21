
import type { Serializable } from "../types";

export function isSerializable(value: unknown): value is Serializable {

    // Check for primitive types
    if (
        value === null ||
        value === undefined ||
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return true;
    };

    // Check if Array and all elements are serializable
    if (Array.isArray(value)) {
        return value.every(isSerializable);
    };

    // Check if plain object and all properties are serializable
    if (typeof value === "object") {
        // Exclude functions, Date, RegExp, Map, Set, etc.
        if (value.constructor !== Object) return false;

        return Object.values(value).every(isSerializable);
    };

    // Other types (function, symbol, class instances, etc.) are not serializable
    return false;

};

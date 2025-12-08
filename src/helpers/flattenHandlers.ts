
/**
 * Recursively traverses an object and generates a flat record of all functions
 * (excluding constructors) found within the object and its prototype chain.
 * The keys are string paths representing the nested structure with '()' appended to function names.
 * Each function is bound to the original object to preserve context.
 *
 * @param {object} obj - The object to traverse.
 * @param {string} [parentPath=""] - The base path used for recursion to build full method paths.
 * @returns {Record<string, (...args: any[]) => any} An object mapping method paths to their bound functions.
 */
function flattenHandlersRecursiveHelper(
    obj: object,
    parentPath: string = ""
): Record<string, (...args: any[]) => any> {
    const result: Record<string, (...args: any[]) => any> = {};

    if (!obj) return result;

    let proto = obj;
    const visitedProps = new Set<string>();

    while (proto && proto !== Object.prototype) {
        for (const key of Object.getOwnPropertyNames(proto)) {
            if (visitedProps.has(key)) continue; // avoid duplicates
            visitedProps.add(key);

            const value = (obj as any)[key];
            const currentPath = parentPath ? `${parentPath}.${key}` : key;

            if (typeof value === "function" && key !== "constructor") {
                result[`${currentPath}()`] = value.bind(obj); // bind to preserve context
            } else if (value && typeof value === "object") {
                Object.assign(result, flattenHandlersRecursiveHelper(value, currentPath));
            }
        }
        proto = Object.getPrototypeOf(proto);
    }

    return result;
};

/**
 * Generates a flat record of valid IPC handler calls from a nested IPC handlers object.
 * This function wraps the recursive helper to expose a simpler API.
 *
 * @param {any} ipcHandlersP - The nested IPC handlers object to process.
 * @returns {Record<string, (...args: any[]) => any} A flat record mapping IPC handler paths to bound functions.
 *
 * @example
 * // Basic usage with nested handlers
 * const handlers = {
 *   user: {
 *     login(name) {
 *       return `User ${name} logged in`;
 *     },
 *     logout() {
 *       return 'User logged out';
 *     }
 *   },
 *   system: {
 *     shutdown() {
 *       return 'System shutting down';
 *     }
 *   }
 * };
 *
 * const flatHandlers = generateValidIpcHandlerCalls(handlers);
 *
 * console.log(flatHandlers);
 * // Output:
 * {
 *    "user.login()",
 *    "user.logout()",
 *    "system.shutdown()"
 * }
 */
export function flattenHandlers(ipcHandlersP: any) {
    return flattenHandlersRecursiveHelper(ipcHandlersP);
};

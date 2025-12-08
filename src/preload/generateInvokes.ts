
import { ipcRenderer } from "electron";

/**
 * Recursively traverses an object and generates a flat record of all functions
 * (excluding constructors) found within the object and its prototype chain.
 * 
 * For each function found, it creates a new function that calls `ipcRenderer.invoke`
 * with a corresponding event name (based on the full nested path of the function),
 * forwarding all arguments.
 * 
 * If the original function is declared as `async`, the generated function is also async.
 * 
 * The keys of the returned object are string paths representing the nested function names
 * with '()' appended.
 * 
 * @param {object} obj - The object to traverse.
 * @param {string} [parentPath=""] - The base path used for recursion to build full method paths.
 * @returns {Record<string, (...args: any[]) => Promise<any>} 
 *          An object mapping method paths to functions that invoke IPC calls via `ipcRenderer.invoke`.
 * 
 * @example
 * // Given the following nested object:
 * const handlers = {
 *   user: {
 *     async login(username) { /* ... *\/ },
 *     logout() { /* ... *\/ }
 *   }
 * };
 * 
 * const invokes = generateInvokes(handlers);
 * 
 * // invokes will be:
 * {
 *     "user.login()": async (...args) => ipcRenderer.invoke("user.login()", ...args),
 *     "user.logout()": (...args) => ipcRenderer.invoke("user.logout()", ...args)
 * }
 * 
 * // Usage:
 * invokes["user.login()"]("Alice").then(result => { /* handle result *\/ });
 */
function generateInvokesRecursiveHelper(
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

                const isAsync = value.constructor.name === 'AsyncFunction';
                const eventName = `${currentPath}()`;

                result[eventName] =
                    isAsync ?
                        async function(
                            ...args
                        ) {
                            return ipcRenderer.invoke(eventName, ...args);
                        }
                    :
                        function (
                            ...args
                        ) {
                            return ipcRenderer.invoke(eventName, ...args);
                        };

            } else if (value && typeof value === "object") {
                Object.assign(result, generateInvokesRecursiveHelper(value, currentPath));
            }
        }
        proto = Object.getPrototypeOf(proto);
    }

    return result;
};

/**
 * Generates an object mapping function paths to IPC invoke calls for the provided object.
 * This is a public wrapper around the recursive helper.
 *
 * @param {object} obj - The object containing nested functions to transform.
 * @returns {Record<string, (...args: any[]) => Promise<any>} 
 *          A flat object with keys representing function paths and values as IPC-invoking functions.
 */
export function generateInvokes(obj: any) {
    return generateInvokesRecursiveHelper(obj);
};

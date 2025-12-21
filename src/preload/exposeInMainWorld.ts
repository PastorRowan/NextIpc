
import type { ContextBridge } from "electron";
import { invoke } from "./invoke";
import { on } from "./on";
import { send } from "./send";

/**
 * Exposes IPC communication methods on the Electron renderer's `window` object
 * under the namespace `ipcR`.
 * 
 * This function uses Electron's `contextBridge` API to safely expose
 * a set of IPC-related utilities (`invoke`, `on`, and `send`) to the renderer
 * process, enabling secure and controlled communication between renderer and main processes.
 *
 * @param {ContextBridge} contextBridge - The Electron contextBridge module instance
 *                                         used to expose APIs in the renderer context.
 * 
 * @example
 * ```ts
 * import { contextBridge } from "electron";
 * import { exposeInMainWorld } from "./exposeInMainWorld";
 *
 * exposeInMainWorld(contextBridge);
 * 
 * // In renderer:
 * import { getIpcR } from "NextIpc/renderer";
 * const { ipcR } = getIpcR();
 * ipcR.invoke("user.get", { id });
 * ```
 */
export function exposeInMainWorld(contextBridge: ContextBridge): void {
    contextBridge.exposeInMainWorld("ipcR", {
        invoke,
        on,
        send
    });
};


import type {} from "electron";
import { createRendererClient } from "./createRendererClient.js";
import { createRendererListeners } from "./createRendererListeners.js";

/**
 * 
 *
 */
export function exposeInMainWorld(contextBridge: Electron.ContextBridge): void {
    contextBridge.exposeInMainWorld("ipcR", {
        createRendererClient,
        createRendererListeners
    });
};

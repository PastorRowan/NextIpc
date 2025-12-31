
import type {} from "electron";
import { createRendererClient } from "./createRendererClient";
import { createRendererListeners } from "./createRendererListeners";

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

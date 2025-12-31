
import type {
    createRendererClient as createRendererClientImp
} from "../preload/createRendererClient";
import type {
    createRendererListeners as createRendererListenersImp
} from "../preload/createRendererListeners";

export interface IpcR {
    createRendererClient: typeof createRendererClientImp;
    createRendererListeners: typeof createRendererListenersImp;
};

// @ts-ignore
const ipcRWin = window.ipcR as IpcR | undefined;

if (
    ipcRWin === undefined ||
    ipcRWin.createRendererClient === undefined ||
    ipcRWin.createRendererListeners === undefined
) {
    throw new Error(
        "ipcR is not properly initialized.\n" +
        "Ensure 'exposeInMainWorld' is called in the preload script to expose the 'ipcR' API\n" +
        "See NextIpc/preload for the required setup."
    );
};

export const createRendererClient = ipcRWin.createRendererClient;
export const createRendererListeners = ipcRWin.createRendererListeners

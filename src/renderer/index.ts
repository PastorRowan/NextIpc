
import type { invoke } from "../preload/invoke";
import type { on } from "../preload/on";
import type { send } from "../preload/send";

export interface IpcR {
    invoke: typeof invoke;
    on: typeof on;
    send: typeof send;
};

// @ts-ignore
const ipcRWin = window.ipcR as IpcR;

if (
    ipcRWin === undefined ||
    ipcRWin.invoke === undefined ||
    ipcRWin.on === undefined ||
    ipcRWin.send === undefined
) {
    throw new Error(
        "ipcR is not properly initialized. " +
        "Ensure that 'exposeInMainWorld' has been called in the preload script " +
        "to expose the 'ipcR' API on the window object. " +
        "See NextIpc/preload for the required setup."
    );
};

export const ipcR = ipcRWin;

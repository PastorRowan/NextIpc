
import { handle } from "./handle";
import { on } from "./on";
import { send } from "./send";

export interface IpcM {
    handle: typeof handle;
    on: typeof on;
    send: typeof send;
};

/**
 * An object exposing IPC communication methods for the main process.
 *
 * This `ipcM` object bundles together the primary IPC utilities:
 * - `handle`: Registers IPC handlers for specific channels.
 * - `on`: Listens for IPC events from the renderer process.
 * - `send`: Sends asynchronous IPC messages to renderer processes.
 *
 * It is designed to facilitate structured, type-safe communication
 * between the Electron main process and renderer processes.
 */
export const ipcM: IpcM = {
    handle,
    on,
    send
};

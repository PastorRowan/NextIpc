
import type {} from "electron"
import type { isSerializable as IsSerializable } from "../dist/helpers/index"
import type { IpcM } from "../dist/main/index";
import type { IpcR } from "../dist/renderer/index";

declare global {

    // Add property to globalThis
    var ipcM: IpcM;

    var payload: any;

    var isSerializable: typeof IsSerializable;

    var webContents: Electron.WebContents;

    // Add property to Window
    interface Window {
        ipcR: IpcR;
    }

}

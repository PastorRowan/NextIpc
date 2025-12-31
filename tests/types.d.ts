
import type {} from "electron"
import type { isSerializable as IsSerializable } from "../dist/helpers/index"
import type { IpcR } from "../dist/renderer/index";
import type { testDomain as testDomainType } from "./e2e/test.domain.ts";
import type {
    createMainClient as CreateMainClientType,
    createMainListeners as createMainListenersType
} from "../dist/main/index";

declare global {

    // Add property to globalThis
    var createMainClient: typeof CreateMainClientType;

    var createMainListeners: typeof createMainListenersType;

    var testDomain: typeof testDomainType;

    var payload: any;

    var isSerializable: typeof IsSerializable;

    var webContents: Electron.WebContents;

    // Add property to Window
    interface Window {
        ipcR: IpcR;
    }

}

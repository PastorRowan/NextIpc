
import type {
    UnwrappedDomain,
    GetEvents
} from "../Domain";
import type {
    EnsureArray,
    AreTupleLengthsEqual
} from "../typeUtilities";
import type {} from "electron";
// Imports Electron namespace type
import { ipcMain } from "electron";

export function createMainListeners<
    Name extends string,
    D extends UnwrappedDomain<Name>
>(
    domain: D & { name: Name }
) {

    return {

        on: function<
            RTMSendChannel extends keyof GetEvents<D, "RTM", "send">,
            Req extends D["events"][RTMSendChannel]["req"],
            Listener extends
                (
                    event: Electron.IpcMainEvent,
                    ...args: EnsureArray<Req>
                ) => void,
            GivenArgs extends Parameters<Listener>,
            ExpectedArgs extends [Electron.IpcMainEvent, ...EnsureArray<Req>]
        >(
            channel: RTMSendChannel,
            listener:
                Listener
                & AreTupleLengthsEqual<
                    GivenArgs,
                    ExpectedArgs
                >
        ): void {
            ipcMain.on(String(channel), listener);
        },

        handle: function<
            RTMInvokeChannel extends keyof GetEvents<D, "RTM", "invoke">,
            Req extends D["events"][RTMInvokeChannel]["req"],
            Res extends D["events"][RTMInvokeChannel]["res"],
            Listener extends
                (
                    event: Electron.IpcMainInvokeEvent,
                    ...args: EnsureArray<Req>
                ) => Res | Promise<Res>,
            GivenArgs extends Parameters<Listener>,
            ExpectedArgs extends [Electron.IpcMainInvokeEvent, ...EnsureArray<Req>]
        >(
            channel: RTMInvokeChannel,
            listener:
                Listener
                & AreTupleLengthsEqual<
                    GivenArgs,
                    ExpectedArgs
                >
        ): void {
            ipcMain.handle(String(channel), listener);
        }

    };

};

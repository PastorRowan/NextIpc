
import type { UnwrappedDomain } from "../Domain";
import type {
    EnsureArray,
    AreTupleLengthsEqual
} from "../typeUtilities";
// Imports Electron namespace type
import type {} from "electron";
import { ipcMain } from "electron";

export function createMainListeners<
    Name extends string,
    D extends UnwrappedDomain<Name>
>(
    domain: D & { name: Name }
) {

    return {

        on: function<
            SendChannel extends keyof D["RendererToMain"]["sends"],
            Req extends D["RendererToMain"]["sends"][SendChannel]["req"],
            Listener extends
                (
                    event: Electron.IpcMainEvent,
                    ...args: EnsureArray<Req>
                ) => void,
            GivenArgs extends Parameters<Listener>,
            ExpectedArgs extends [Electron.IpcMainEvent, ...EnsureArray<Req>]
        >(
            channel: SendChannel,
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
            InvokeChannel extends keyof D["RendererToMain"]["invokes"],
            Req extends D["RendererToMain"]["invokes"][InvokeChannel]["req"],
            Res extends D["RendererToMain"]["invokes"][InvokeChannel]["res"],
            Listener extends
                (
                    event: Electron.IpcMainInvokeEvent,
                    ...args: EnsureArray<Req>
                ) => Res | Promise<Res>,
            GivenArgs extends Parameters<Listener>,
            ExpectedArgs extends [Electron.IpcMainInvokeEvent, ...EnsureArray<Req>]
        >(
            channel: InvokeChannel,
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

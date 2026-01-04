
import type { UnwrappedDomain } from "../Domain";
import type {
    EnsureArray,
    AreTupleLengthsEqual
} from "../typeUtilities";
// Imports Electron namespace type
import type {} from "electron";
import { ipcMain } from "electron";

export function createMainListeners<
    D extends UnwrappedDomain
>(
    domain: D
) {

    return {

        on: function<
            Channel extends keyof D["RendererToMain"]["sends"],
            Req extends D["RendererToMain"]["sends"][Channel]["req"],
            Listener extends
                (
                    event: Electron.IpcMainEvent,
                    ...args: EnsureArray<Req>
                ) => void,
            GivenArgs extends Parameters<Listener>,
            ExpectedArgs extends [Electron.IpcMainEvent, ...EnsureArray<Req>]
        >(
            channel: Channel,
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
            Channel extends keyof D["RendererToMain"]["invokes"],
            Req extends D["RendererToMain"]["invokes"][Channel]["req"],
            Res extends D["RendererToMain"]["invokes"][Channel]["res"],
            Listener extends
                (
                    event: Electron.IpcMainInvokeEvent,
                    ...args: EnsureArray<Req>
                ) => Res | Promise<Res>,
            GivenArgs extends Parameters<Listener>,
            ExpectedArgs extends [Electron.IpcMainInvokeEvent, ...EnsureArray<Req>]
        >(
            channel: Channel,
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

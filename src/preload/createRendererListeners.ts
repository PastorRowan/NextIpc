
import type {
    UnwrappedDomain,
    GetEvents
} from "../Domain";
import type {
    EnsureArray,
    AreTupleLengthsEqual
} from "../typeUtilities";
// Imports Electron namespace type
import type {} from "electron";
import { ipcRenderer } from "electron";

export function createRendererListeners<
    Name extends string,
    D extends UnwrappedDomain<Name>
>(
    domain: D & { name: Name }
) {

    return {
        on: function<
            MTRSendChannel extends keyof GetEvents<D, "MTR", "send">,
            Req extends D["events"][MTRSendChannel]["req"],
            Listener extends
                (
                    event: Electron.IpcRendererEvent,
                    ...args: EnsureArray<Req>
                ) => void,
            GivenArgs extends Parameters<Listener>,
            ExpectedArgs extends [Electron.IpcRendererEvent, ...EnsureArray<Req>]
        >(
            channel: MTRSendChannel,
            listener:
                Listener
                & AreTupleLengthsEqual<
                    GivenArgs,
                    ExpectedArgs
                >
        ): void {
            ipcRenderer.on(String(channel), listener);
        }
    };

};

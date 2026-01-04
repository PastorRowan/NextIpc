
import type { UnwrappedDomain } from "../Domain";
import type {
    EnsureArray,
    AreTupleLengthsEqual
} from "../typeUtilities";
// Imports Electron namespace type
import type {} from "electron";
import { ipcRenderer } from "electron";

export function createRendererListeners<
    D extends UnwrappedDomain
>(
    domain: D
) {

    return {
        on: function<
            Channel extends keyof D["MainToRenderer"]["sends"],
            Req extends D["MainToRenderer"]["sends"][Channel]["req"],
            Listener extends
                (
                    event: Electron.IpcRendererEvent,
                    ...args: EnsureArray<Req>
                ) => void,
            GivenArgs extends Parameters<Listener>,
            ExpectedArgs extends [Electron.IpcRendererEvent, ...EnsureArray<Req>]
        >(
            channel: Channel,
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

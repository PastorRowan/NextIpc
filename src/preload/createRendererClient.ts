
import type { UnwrappedDomain, } from "../Domain";
import type { EnsureArray } from "../typeUtilities";
import { ipcRenderer } from "electron";

export function createRendererClient<
    Name extends string,
    D extends UnwrappedDomain<Name>
>(
    domain: D & { name: Name }
) {
    return {
        send: function<
            SendChannel extends keyof D["RendererToMain"]["sends"],
            Req extends D["RendererToMain"]["sends"][SendChannel]["req"]
        >(
            channel: SendChannel,
            ...args: EnsureArray<Req>
        ): void {
            ipcRenderer.send(String(channel), ...args as any);
        },
        invoke: function<
            InvokeChannel extends keyof D["RendererToMain"]["invokes"],
            Req extends D["RendererToMain"]["invokes"][InvokeChannel]["req"],
            Res extends D["RendererToMain"]["invokes"][InvokeChannel]["res"]
        >(
            channel: InvokeChannel,
            ...args: EnsureArray<Req>
        ): Promise<Res> {
            console.log("channel: ", channel);
            console.log("args: ", args);
            console.log("args[0]: ", args[0]);
            return ipcRenderer.invoke(String(channel), ...args as any);
        }
    };
};

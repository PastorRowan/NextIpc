
import type {
    UnwrappedDomain,
    GetEvents
} from "../Domain";
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
            RTMSendChannel extends keyof GetEvents<D, "RTM", "send">,
            Req extends D["events"][RTMSendChannel]["req"]
        >(
            channel: RTMSendChannel,
            ...args: EnsureArray<Req>
        ): void {
            ipcRenderer.send(String(channel), ...args as any);
        },
        invoke: function<
            InvokeChannel extends keyof GetEvents<D, "RTM", "invoke">,
            Req extends D["events"][InvokeChannel]["req"],
            Res extends D["events"][InvokeChannel]["res"]
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

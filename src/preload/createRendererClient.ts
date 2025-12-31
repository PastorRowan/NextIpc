
import type { UnwrappedDomain, } from "../Domain";
import type { EnsureArray } from "../typeUtilities";
import { ipcRenderer } from "electron";

export function createRendererClient<
    D extends UnwrappedDomain
>(
    domain: D
) {
    const domainName = domain.name;
    return {
        send: function<
            ChannelName extends keyof D["RendererToMain"]["sends"],
            Req extends D["RendererToMain"]["sends"][ChannelName]["req"]
        >(
            channel: ChannelName,
            ...args: EnsureArray<Req>
        ): void {
            ipcRenderer.send(`${domainName}:${String(channel)}`, ...args as any[]);
        },
        invoke: function<
            ChannelName extends keyof D["RendererToMain"]["invokes"],
            Req extends D["RendererToMain"]["invokes"][ChannelName]["req"],
            Res extends D["RendererToMain"]["invokes"][ChannelName]["res"]
        >(
            channel: ChannelName,
            ...args: EnsureArray<Req>
        ): Promise<Res> {
            return ipcRenderer.invoke(`${domainName}:${String(channel)}`, ...args as any);
        }
    };
};

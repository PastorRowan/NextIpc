
import { ipcRenderer } from "electron";
import type {
    RendererToMainInvokeChannels,
    ArgsOfChannel
} from "../types";

export function invoke<
    ChannelName extends keyof RendererToMainInvokeChannels,
    ChannelArgs extends ArgsOfChannel<RendererToMainInvokeChannels, ChannelName>,
    Res extends RendererToMainInvokeChannels[ChannelName]["res"]
>(
    channel: ChannelName,
    ...args: ChannelArgs
): Promise<Res> {
    return ipcRenderer.invoke(channel as string, ...args) as Promise<Res>;
};

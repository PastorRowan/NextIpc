
import { ipcRenderer } from "electron";
import type {
    RendererToMainSendChannels,
    ArgsOfChannel
} from "../types";

export function send<
    ChannelName extends keyof RendererToMainSendChannels,
    ChannelArgs extends ArgsOfChannel<RendererToMainSendChannels, ChannelName>
>(
    channel: ChannelName,
    ...args: ChannelArgs
): void {
    ipcRenderer.send(channel as string, ...args);
};

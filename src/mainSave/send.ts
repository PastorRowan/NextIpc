
import type {} from "electron";
import type {
    MainToRendererSendChannels,
    ArgsOfChannel
} from "../types";

export function send<
    ChannelName extends keyof MainToRendererSendChannels,
    ChannelArgs extends ArgsOfChannel<MainToRendererSendChannels, ChannelName>
>(
    webContents: Electron.WebContents,
    channel: ChannelName,
    ...args: ChannelArgs
): void {
    webContents.send(channel as string, ...args);
};

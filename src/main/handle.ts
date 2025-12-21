
import { ipcMain, IpcMainInvokeEvent } from "electron";
import type {
    ArgsOfChannel,
    RendererToMainInvokeChannels,
    AreTupleLengthsEqual
} from "../types";

// Wrap your `handle` function with this constraint
export function handle<
    ChannelName extends keyof RendererToMainInvokeChannels,
    ChannelArgs extends ArgsOfChannel<RendererToMainInvokeChannels, ChannelName>,
    Listener extends (
        event: IpcMainInvokeEvent,
        ...args: ChannelArgs
    ) => Promise<RendererToMainInvokeChannels[ChannelName]["res"]> | RendererToMainInvokeChannels[ChannelName]["res"],
    GivenArgs extends Parameters<Listener>,
    ExpectedArgs extends [ IpcMainInvokeEvent, ...ChannelArgs ]
>(
    channel: ChannelName,
    listener:
        Listener &
        AreTupleLengthsEqual<
            GivenArgs,
            ExpectedArgs
        >
): void {
    ipcMain.handle(channel as string, async (event, ...payload) => {
        return await listener(event, ...(payload as any));
    });
};

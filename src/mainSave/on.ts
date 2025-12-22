
import { ipcMain, IpcMainEvent } from "electron";
import type {
    RendererToMainSendChannels,
    ArgsOfChannel,
    AreTupleLengthsEqual
} from "../types";

export function on<
    ChannelName extends keyof RendererToMainSendChannels,
    ChannelArgs extends ArgsOfChannel<RendererToMainSendChannels, ChannelName>,
    Listener extends (
        event: IpcMainEvent,
        ...args: ChannelArgs
    ) => void,
    GivenArgs extends Parameters<Listener>,
    ExpectedArgs extends [ IpcMainEvent, ...ChannelArgs ]
>(
    channel: ChannelName,
    listener:
        Listener &
        AreTupleLengthsEqual<
            GivenArgs,
            ExpectedArgs
        >
): void {
    ipcMain.on(channel as string, (event, ...payload) => {
        listener(event, ...payload as any);
    });
};

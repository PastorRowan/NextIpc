
import {
    ipcRenderer,
    IpcRendererEvent
} from "electron";
import type {
    MainToRendererSendChannels,
    ArgsOfChannel,
    AreTupleLengthsEqual
} from "../types";

export function on<
    ChannelName extends keyof MainToRendererSendChannels,
    ChannelArgs extends ArgsOfChannel<MainToRendererSendChannels, ChannelName>,
    Listener extends (
        event: IpcRendererEvent,
        ...args: ChannelArgs
    ) => void,
    GivenArgs extends Parameters<Listener>,
    ExpectedArgs extends [ IpcRendererEvent, ...ChannelArgs ]
> (
    channel: ChannelName,
    listener:
        Listener &
        AreTupleLengthsEqual<
            GivenArgs,
            ExpectedArgs
        >
): void {
    ipcRenderer.on(channel as string, function(event, ...payload) {
        listener(event, ...payload as any);
    });
};

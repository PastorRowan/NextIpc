
import type { Config } from "../index";
import { ipcMain, IpcMainInvokeEvent } from "electron";
import type {
    ArgsOfChannel,
    RendererToMainInvokeChannels,
    AreTupleLengthsEqual
} from "../types";

// Wrap your `handle` function with this constraint
export function handle<
    Domain extends keyof Config,
    Channel extends keyof Config[Domain]["RendererToMain"]["invokes"],
    ReqArgs extends Config[Domain]["RendererToMain"]["invokes"][Channel]["req"],
    ResArgs extends Config[Domain]["RendererToMain"]["invokes"][Channel]["res"],
    Listener extends (
        event: IpcMainInvokeEvent,
        ...args: ReqArgs
    ) => Promise<ResArgs> | ResArgs,
    GivenArgs extends Parameters<Listener>,
    ExpectedArgs extends [ IpcMainInvokeEvent, ...ReqArgs ]
>(
    domain: Domain,
    channel: Channel,
    listener:
        Listener &
        AreTupleLengthsEqual<
            GivenArgs,
            ExpectedArgs
        >
): void {
    ipcMain.handle(`${String(domain)}:${String(channel)}`, async function(event, ...payload) {
        return await listener(event, ...(payload as any));
    });
};

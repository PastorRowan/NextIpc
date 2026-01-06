
import type {
    UnwrappedDomain,
    GetEvents
} from "../Domain";
import type { EnsureArray } from "../typeUtilities";
import type {} from "electron";

export function createMainClient<
    Name extends string,
    D extends UnwrappedDomain<Name>
>(
    domain: D & { name: Name }
) {
    return {
        send: function<
            MTRSendChannel extends keyof GetEvents<D, "MTR", "send">,
            Req extends D["events"][MTRSendChannel]["req"]
        >(
            webContents: Electron.WebContents,
            channel: MTRSendChannel,
            ...args: EnsureArray<Req>
        ): void {
            webContents.send(String(channel), ...args as any[]);
        }
    };
};

const testDomain = {
    name: "test",
    events: {
        "RTM:send:test:update": {
            req: {
                id: {} as string,
            },
        },
        "RTM:invoke:test:get": {
            req: {
                id: {} as string
            },
            res: {
                id: {} as string
            },
        },
        "RTM:invoke:test:pull": {
            req: {
                id: {} as string
            },
            res: {
                id: {} as string
            },
        },
        "MTR:send:test:notify": {
            req: {
                id: {} as string
            },
        },
    },
}

type DType = typeof testDomain;

type InvokeEvents = keyof GetEvents<DType, "RTM", "send">

type Test1 = DType["events"][InvokeEvents]["req"];

const testClient = createMainClient(testDomain);

testClient.send(new Electron.webContents, "MTR:send:test:notify", { id: "asd" });


import type {} from "electron";
import type { UnwrappedDomain } from "../Domain";
import type { EnsureArray } from "../typeUtilities";

export function createMainClient<
    Name extends string,
    D extends UnwrappedDomain<Name>
>(
    domain: D & { name: Name }
) {
    return {
        send: function<
            SendChannel extends keyof D["MainToRenderer"]["sends"],
            Req extends D["MainToRenderer"]["sends"][SendChannel]["req"]
        >(
            webContents: Electron.WebContents,
            channel: SendChannel,
            ...args: EnsureArray<Req>
        ): void {
            webContents.send(`${domain.name}:${String(channel)}`, ...args as any[]);
        }
    };
};

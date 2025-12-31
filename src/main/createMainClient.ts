
import type {} from "electron";
import type { UnwrappedDomain } from "../Domain";
import type {
    EnsureArray
} from "../typeUtilities";

export function createMainClient<
    D extends UnwrappedDomain
>(
    domain: D
) {
    return {
        send: function<
            ChannelName extends keyof D["MainToRenderer"]["sends"],
            Req extends D["MainToRenderer"]["sends"]["req"]
        >(
            webContents: Electron.WebContents,
            channel: ChannelName,
            ...args: EnsureArray<Req>
        ): void {
            webContents.send(`${domain.name}:${String(channel)}`, ...args as any[]);
        }
    };
};

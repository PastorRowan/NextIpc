
import type { UnwrappedDomain } from "../Domain";
import { ipcRenderer } from "electron";
import { createListeners } from "../shared";

export function createRendererListeners<
    D extends UnwrappedDomain
>(
    domain: D
) {

    return createListeners({
        domain,
        direction: "MainToRenderer",
        registerSendListener: function(channel: keyof D["MainToRenderer"]["sends"], listener) {
            ipcRenderer.on(String(channel), listener);
        },
        registerInvokeListener: function(channel: keyof D["MainToRenderer"]["invokes"], listener) {
            throw new Error("MainToRenderer invoke listeners are disabled");
        }
    });

};

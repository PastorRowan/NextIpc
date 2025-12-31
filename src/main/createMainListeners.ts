
import type { UnwrappedDomain } from "../Domain";
import { ipcMain } from "electron";
import { createListeners } from "../shared";

export function createMainListeners<
    D extends UnwrappedDomain
>(
    domain: D
) {
    return createListeners({
        domain,
        direction: "RendererToMain",
        registerSendListener: function(channel: keyof D["RendererToMain"]["sends"], listener) {
            ipcMain.on(String(channel), listener);
        },
        registerInvokeListener: function(channel: keyof D["RendererToMain"]["invokes"], listener) {
            ipcMain.handle(String(channel), listener);
        }
    })
};

import { createDefineDomain } from "../createDefineDomain";

const {
    defineDomain,
    Req,
    Res
} = createDefineDomain({
    policy: {
        req: {
            object: true,
            array: false,
            primitive: false
        },
        res: {
            object: true,
            array: false,
            primitive: false
        }
    }
});

const testDomain = defineDomain({
    name: "test",
    RendererToMain: {
        sends: {
            "update": {
                req: Req<{ id: string }>()
            }
        },
        invokes: {
            "get": {
                req: Req<{ id: string }>(),
                res: Res<{ id: string }>()
            }
        }
    },
    MainToRenderer: {
        sends: {
            "notify": {
                req: Req<{ id: string }>()
            }
        },
        invokes: {

        }
    }
});

const testListeners = createMainListeners(testDomain);

testListeners.addHandler("get", function(_, { id }) {
    return { id };
});

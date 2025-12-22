
import { createDefineDomain } from "./types/createDefineContract";
import { defineConfig } from "./types/defineConfig";

const { defineDomain } = createDefineDomain({
    policy: {
        req: {
            object: true,
            primitive: false,
            array: false
        },
        res: {
            object: true,
            primitive: false,
            array: false
        }
    }
});

export const defaultConfig = defineConfig({
    ExampleDomain: defineDomain({
        RendererToMain: {
            sends: {
                "user:get": {
                    req: {} as { id: string }
                }
            },
            invokes: {
                "user:send": {
                    req: {} as {},
                    res: {} as {}
                }
            }
        },
        MainToRenderer: {
            sends: {},
            invokes: {}
        }
    })
});

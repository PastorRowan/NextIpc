
import {
    defineConfig
} from "./types";

export const defaultConfig = defineConfig({
    policy: {
        req: {},
        res: {}
    },
    domains: {
        ExampleDomain: {
            RendererToMain: {
                sends: {
                    "user:get": {
                        req: {}
                    }
                },
                invokes: {
                    "user:send": {
                        req: {},
                        res: {}
                    }
                }
            },
            MainToRenderer: {
                sends: {},
                invokes: {}
            }
        }
    }
});

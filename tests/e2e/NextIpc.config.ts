
// somewhere in user code (e.g., user-augmentation.d.ts)
import { defineConfig } from "NextIpc";

const config = defineConfig({
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
    },
    domains: {
        User: {
            RendererToMain: {
                sends: {
                    "user:set": {
                        req: {} as [ id: string ]
                    }
                },
                invokes: {
                    "user:get": {
                        req: {} as { id: string, name: string },
                        res: {} as { id: string, name: string }
                    }
                }
            },
            MainToRenderer: {
                sends: {

                },
                invokes: {

                }
            }
        }
    }
});

declare module "NextIpc" {
    export interface NextIpc {
        Config: typeof config
    }
};


import { createDefineDomain } from "../../dist/index.js";

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

export const testDomain = defineDomain({
    name: "test",
    RendererToMain: {
        sends: {
            "test:update": {
                req: Req<{ id: string }>()
            }
        },
        invokes: {
            "test:get": {
                req: Req<{ id: string }>(),
                res: Res<{ id: string }>()
            }
        }
    },
    MainToRenderer: {
        sends: {
            "test:notify": {
                req: Req<{ id: string }>()
            }
        },
        invokes: {

        }
    }
});

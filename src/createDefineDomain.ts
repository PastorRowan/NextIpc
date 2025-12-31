
import type {
    Policy,
    AllowedByPolicy,
    PolicyOptions
} from "./Policy";
import type {
    WrappedDomain,
    UnwrapDomain,
    ReqArgs,
    ResArgs
} from "./Domain";

type KillExtraKeys<
    T,
    Shape
> =
    T extends object
        ? Shape extends object
        ? {
            [K in keyof T]:
                K extends keyof Shape
                ? KillExtraKeys<T[K], Shape[K]>
                : never;
            }
        : never
        : T;

// next-ipc.ts (library code)
export function createDefineDomain<
    ReqObjAllowed extends boolean,
    ReqArrayAllowed extends boolean,
    ReqPrimitiveAllowed extends boolean,
    ResObjectAllowed extends boolean,
    ResArrayAllowed extends boolean,
    ResPrimitiveAllowed extends boolean
>(
    kwargs: {
        policy: {
            req: {
                object: ReqObjAllowed,
                array: ReqArrayAllowed,
                primitive: ReqPrimitiveAllowed
            },
            res: {
                object: ResObjectAllowed,
                array: ResArrayAllowed,
                primitive: ResPrimitiveAllowed
            }
        }
    }
) {

    type P = Policy<
        PolicyOptions<
            ReqObjAllowed,
            ReqArrayAllowed,
            ReqPrimitiveAllowed
        >,
        PolicyOptions<
            ResObjectAllowed,
            ResArrayAllowed,
            ResPrimitiveAllowed
        >
    >;

    function Req<
        T extends AllowedByPolicy<P["req"]>
    >() {
        return {} as ReqArgs<T>;
    };

    function Res<
        T extends AllowedByPolicy<P["res"]>
    >() {
        return {} as ResArgs<T>;
    };

    return {
        Req,
        Res,
        defineDomain: function<
            D extends WrappedDomain
        >(
            domain: D
        ): UnwrapDomain<D> {
            return domain as any;
        }
    };

};

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

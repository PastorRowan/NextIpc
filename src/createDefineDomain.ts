
import type {
    Policy,
    AllowedByPolicy,
    PolicyOptions
} from "./Policy";
import type {
    WrappedDomain,
    UnwrappedDomain,
    UnwrapDomain,
    ReqArgs,
    ResArgs,
    GetEvents
} from "./Domain";

type KillExtraKeys<
    Actual,
    Expected,
    RetType =
        Actual extends ReqArgs<unknown> | ResArgs<unknown>
            ? Actual
            : Expected extends ReqArgs<unknown> | ResArgs<unknown>
                ? Actual
                : {
                    [K in keyof Actual]:
                        K extends keyof Expected
                            ? Actual[K] extends object
                                ? Expected[K] extends object
                                    ? KillExtraKeys<Actual[K], Expected[K]>
                                    : Actual[K]
                                : Actual[K]
                            : {
                                ERROR: `!!! Invalid key '${K & string}', expected key: '${[keyof Expected] & string}'`
                            }
                }
> = Actual extends RetType ? unknown : RetType;

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
            Name extends string,
            WrappedD extends WrappedDomain<Name>
        >(
            domain: WrappedD & { name: Name } & KillExtraKeys<WrappedD, WrappedDomain<Name>>
        ): UnwrapDomain<WrappedD> {
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
    events: {
        "RTM:send:test:update": {
            req: Req<{ id: string }>(),
        },
        "RTM:invoke:test:get": {
            req: Req<{ id: string }>(),
            res: Res<{ id: string }>()
        },
        "RTM:invoke:test:pull": {
            req: Req<{ id: string }>(),
            res: Res<{ id: string }>()
        },
        "MTR:send:test:notify": {
            req: Req<{ id: string }>()
        }
    }
});

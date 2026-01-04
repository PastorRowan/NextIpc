
import type {
    Policy,
    AllowedByPolicy,
    PolicyOptions
} from "./Policy";
import type {
    WrappedDomain,
    UnwrapDomain,
    Direction,
    ReqArgs,
    ResArgs
} from "./Domain";

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

    type EnforceDirectionChannels<
        Name extends string,
        Dir extends Direction<Name, ReqArgs<unknown>, ResArgs<unknown>>,
        InvalidInvokes = {
            [Channel in keyof Dir["invokes"] as
                Channel extends `${Name}:${string}` ? never : Channel
            ]: {
                error: `   ❌ Channel name '${Extract<Channel, string>}' is invalid. Expected format: '${Name}:string'   `;
            };
        },
        InvalidSends = {
            [Channel in keyof Dir["sends"] as
                Channel extends `${Name}:${string}` ? never : Channel
            ]: {
                error: `   ❌ Channel name '${Extract<Channel, string>}' is invalid. Expected format: '${Name}:string'   `;
            };
        }
    > = {
        invokes: keyof InvalidInvokes extends never ? unknown : InvalidInvokes;
        sends: keyof InvalidSends extends never ? unknown : InvalidSends;
    };

    type KillExtraKeys<
        Actual,
        Expected
    > =
        // Stop recursion for ReqArgs and ResArgs type
        Actual extends ReqArgs<unknown> | ResArgs<unknown>
            ? Actual
            : Expected extends ReqArgs<unknown> | ResArgs<unknown>
                ? Actual
                : 
                {
                    [K in keyof Actual]:
                        K extends keyof Expected
                            ? Actual[K] extends object
                                ? Expected[K] extends object
                                    ? KillExtraKeys<Actual[K], Expected[K]>
                                    : Actual[K]
                                : Actual[K]
                            : never;
    };

    return {
        Req,
        Res,
        defineDomain: function<
            Name extends string,
            RTM extends Direction<Name, ReqArgs<unknown>, ResArgs<unknown>>,
            MTR extends Direction<Name, ReqArgs<unknown>, ResArgs<unknown>>
        >(
            domain: {
                name: Name;
                RendererToMain:
                    RTM &
                    EnforceDirectionChannels<Name, RTM> &
                    KillExtraKeys<RTM, Direction<Name, ReqArgs<unknown>, ResArgs<unknown>>>;
                MainToRenderer:
                    MTR &
                    EnforceDirectionChannels<Name, MTR> &
                    KillExtraKeys<MTR, Direction<Name, ReqArgs<unknown>, ResArgs<unknown>>>;
            }
        ): UnwrapDomain<
                WrappedDomain<
                    Name,
                    typeof domain.RendererToMain,
                    typeof domain.MainToRenderer
                >
            > {
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

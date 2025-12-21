
import { PolicyOptions, Allowed } from "./policy";

// Basic channel shapes
type SendChannel<ReqPolicy extends PolicyOptions> = {
    req: Allowed<ReqPolicy>;
}

// 2. Update InvokeChannel with req and res policies
type InvokeChannel<
    ReqPolicy extends PolicyOptions,
    ResPolicy extends PolicyOptions
> = {
    req: Allowed<ReqPolicy>;
    res: Allowed<ResPolicy>;
}

export type DirectionType = "RendererToMain" | "MainToRenderer";

export type SendChannelsGen<
    ReqPolicy extends PolicyOptions
> = {
    [key: string]: SendChannel<ReqPolicy>
};

export type InvokeChannelsGen<
    ReqPolicy extends PolicyOptions,
    ResPolicy extends PolicyOptions
> = {
    [key: string]:
        InvokeChannel<
            ReqPolicy,
            ResPolicy
        >
};

type Domain<
    ReqPolicy extends PolicyOptions,
    ResPolicy extends PolicyOptions
> = {
    [D in DirectionType]: {
        sends: SendChannelsGen<
            ReqPolicy
        >,
        invokes: InvokeChannelsGen<
            ReqPolicy,
            ResPolicy
        >
    };
};

/*
interface DomainMapType {
    [key: string]: {
        [D in DirectionType]: {
            sends: {
                [key: string]: {
                    req: {},
                    res: {}
                };
            };
            invokes: {
                [key: string]: {
                    req: {},
                    res: {}
                };
            };
        };
    };
};
*/

export type ChannelsGen<
    ReqPolicy extends PolicyOptions,
    ResPolicy extends PolicyOptions
> =
    | SendChannelsGen<
        ReqPolicy
    >
    | InvokeChannelsGen<
        ReqPolicy,
        ResPolicy
    >;

/**
 * Shape every domain must conform to
 */
export type DomainMapTypeGen<
    ReqPolicy extends PolicyOptions,
    ResPolicy extends PolicyOptions
> = {
    [key: string]:
        Domain<
            ReqPolicy,
            ResPolicy
        >
};

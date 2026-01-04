
export declare const REQ: unique symbol;
export declare const RES: unique symbol;

export type ReqArgs<T> = T & { readonly [REQ]: true };
export type ResArgs<T> = T & { readonly [RES]: true };

export type DirectionType = "RendererToMain" | "MainToRenderer";

export type Direction<
    Name extends string,
    Req,
    Res
> = {
    sends: Record<`${Name}:${string}`, { req: Req }>,
    invokes: Record<`${Name}:${string}`, { req: Req, res: Res }>
};

// WrappedDomain has req and res branded
export type WrappedDomain<
    Name extends string,
    RTM extends
        Direction<
            Name,
            ReqArgs<unknown>,
            ResArgs<unknown>
        >
    =
        Direction<
            Name,
            ReqArgs<unknown>,
            ResArgs<unknown>
        >,
    MTR extends
        Direction<
            Name,
            ReqArgs<unknown>,
            ResArgs<unknown>
        >
    =
        Direction<
            Name,
            ReqArgs<unknown>,
            ResArgs<unknown>
        >
> = {
    name: Name,
    RendererToMain: RTM,
    MainToRenderer: MTR
};

// Unwrap ReqArgs and ResArgs recursively
export type UnwrapDomain<T> =
    T extends ReqArgs<infer U>
        ? U
        : T extends ResArgs<infer U>
            ? U
            : T extends object
                ? {
                    [K in keyof T]: UnwrapDomain<T[K]>
                }
                : T;

// UnwrappedDomain has req and res unwrapped to unknown
export type UnwrappedDomain<
    Name extends string,
    RTM extends
        Direction<
            Name,
            unknown,
            unknown
        >
    =
        Direction<
            Name,
            unknown,
            unknown
        >,
    MTR extends
        Direction<
            Name,
            unknown,
            unknown
        >
    =
        Direction<
            Name,
            unknown,
            unknown
        >
> = {
    name: Name,
    RendererToMain: RTM,
    MainToRenderer: MTR
};

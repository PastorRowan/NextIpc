
export declare const REQ: unique symbol;
export declare const RES: unique symbol;

export type ReqArgs<T> = T & { readonly [REQ]: true };
export type ResArgs<T> = T & { readonly [RES]: true };

export type DirectionType = "RendererToMain" | "MainToRenderer";

// WrappedDomain has req and res branded
export type WrappedDomain<
    Name extends string
> = {
    name: Name,
    RendererToMain: {
        sends: Record<`${Name}:${string}`, { req: ReqArgs<unknown> }>,
        invokes: Record<`${Name}:${string}`, { req: ReqArgs<unknown>, res: ResArgs<unknown> }>
    },
    MainToRenderer: {
        sends: Record<`${Name}:${string}`, { req: ReqArgs<unknown> }>,
        invokes: Record<`${Name}:${string}`, { req: ReqArgs<unknown>, res: ResArgs<unknown> }>
    }
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
    Name extends string
> = {
    name: Name,
    RendererToMain: {
        sends: Record<`${Name}:${string}`, { req: unknown }>,
        invokes: Record<`${Name}:${string}`, { req: unknown, res: unknown }>
    },
    MainToRenderer: {
        sends: Record<`${Name}:${string}`, { req: unknown }>,
        invokes: Record<`${Name}:${string}`, { req: unknown, res: unknown }>
    }
};

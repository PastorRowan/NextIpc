
declare const REQ: unique symbol;
declare const RES: unique symbol;

export type ReqArgs<T> = T & { readonly [REQ]: true };
export type ResArgs<T> = T & { readonly [RES]: true };

export type StripReq<T> = T extends infer U & { readonly [REQ]: true } ? U : T;
export type StripRes<T> = T extends infer U & { readonly [RES]: true } ? U : T;

export type DirectionType = "RendererToMain" | "MainToRenderer";

// WrappedDomain has req and res branded
export type WrappedDomain = {
    name: string;
    RendererToMain: {
        sends: Record<string, { req: ReqArgs<unknown> }>;
        invokes: Record<string, { req: ReqArgs<unknown>, res: ResArgs<unknown> }>
    },
    MainToRenderer: {
        sends: Record<string, { req: ReqArgs<unknown> }>;
        invokes: Record<string, { req: ReqArgs<unknown>, res: ResArgs<unknown> }>
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
export type UnwrappedDomain = {
    name: string;
    RendererToMain: {
        sends: Record<string, { req: unknown }>;
        invokes: Record<string, { req: unknown, res: unknown }>;
    };
    MainToRenderer: {
        sends: Record<string, { req: unknown }>;
        invokes: Record<string, { req: unknown, res: unknown }>;
    };
};

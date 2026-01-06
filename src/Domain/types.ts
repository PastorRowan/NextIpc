
export declare const REQ: unique symbol;
export declare const RES: unique symbol;

export type ReqArgs<T> = T & { readonly [REQ]: true };
export type ResArgs<T> = T & { readonly [RES]: true };

export type DirectionType = "RTM" | "MTR";

export type EventType = "invoke" | "send";

// Simple helper
type GetEventNames<Domain extends UnwrappedDomain, Dir extends DirectionType, Type extends EventType> = 
    Extract<keyof Domain["events"], `${Dir}:${Type}:${Domain["name"]}:${string}`> extends 
        `${Dir}:${Type}:${Domain["name"]}:${infer N}` ? N : never;

export type GetEvents<
    Domain extends UnwrappedDomain,
    Dir extends DirectionType = DirectionType,
    EventTypeFilter extends EventType = EventType,
    DomainName extends Domain["name"] = Domain["name"],
    EventNameFilter extends GetEventNames<Domain, Dir, EventTypeFilter> = GetEventNames<Domain, Dir, EventTypeFilter>
> = {
    [K in keyof Domain["events"] as 
        K extends `${Dir}:${EventTypeFilter}:${DomainName}:${EventNameFilter}` 
            ? K
            : never
    ]: Domain["events"][K]
};

// WrappedDomain has req and res branded
export type WrappedDomain<
    Name extends string = string
> = {
    name: Name,
    events:
        & Record<`RTM:send:${Name}:${string}`, { req: ReqArgs<unknown> }>
        & Record<`RTM:invoke:${Name}:${string}`, { req: ReqArgs<unknown>, res: ResArgs<unknown> }>
        & Record<`MTR:send:${Name}:${string}`, { req: ReqArgs<unknown> }>
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
/*
export type UnwrappedDomain<
    Name extends string = string
> = {
    name: Name,
    events:
        & Record<`RTM:send:${Name}:${string}`, { req: unknown, res: never }>
        & Record<`RTM:invoke:${Name}:${string}`, { req: unknown, res: unknown }>
        & Record<`MTR:send:${Name}:${string}`, { req: unknown }>
};
*/

export type UnwrappedDomain<
    Name extends string = string
> = {
    name: Name,
    events: {
        [K in `${DirectionType}:${EventType}:${Name}:${string}`]:
            K extends `${DirectionType}:${infer E}:${Name}:${string}`
                ? E extends "invoke"
                    ? { req: unknown; res: unknown }
                    : E extends "send"
                        ? { req: unknown }  // Make res optional with never
                    : never
                : never;
    };
};

type TestDomain = UnwrappedDomain;

type InvokeReq = TestDomain["events"]["RTM:invoke:test:asdasd"]["req"];

type InvokeRes = TestDomain["events"]["RTM:invoke:test:asdasd"]["req"];

type SendReq = TestDomain["events"]["RTM:send:test:asdasd"]["req"];

type Test1 = `RTM:send:${string}:${string}`;

type SendRes = TestDomain["events"][Test1]["res"];

function send<
    MTRSendChannel extends keyof GetEvents<TestDomain, "MTR", "send">,
    Req extends TestDomain["events"][MTRSendChannel]["res"]
>(
    channel: MTRSendChannel,
    ...args: any & Req
): void {

}

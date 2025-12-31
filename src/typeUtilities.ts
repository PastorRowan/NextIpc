
// Utility to get args tuple type from the req property
export type EnsureArray<Args> =
    Args extends any[]
        ? Args
        : [Args];

type BuildTuple<N extends number, R extends any[] = []> =
    R["length"] extends N ? R : BuildTuple<N, [...R, any]>;

type Subtract<A extends number, B extends number> =
    BuildTuple<A> extends [...BuildTuple<B>, ...infer Rest]
        ? Rest["length"]
        : never;

type LessThan<A extends number, B extends number> =
    BuildTuple<B> extends [...BuildTuple<A>, ...infer _]
        ? A extends B
            ? false
            : true
        : false;

export type AreTupleLengthsEqual<
    Given extends any[],
    Expected extends any[]
> =
    Given["length"] extends Expected["length"]
        ? {}
        : LessThan<Given["length"], Expected["length"]> extends true
            ? `❌ ${Subtract<Expected["length"], Given["length"]>} too few arguments`
            : `❌ ${Subtract<Given["length"], Expected["length"]>} too many argumentssdasdasdasdasdasd`;

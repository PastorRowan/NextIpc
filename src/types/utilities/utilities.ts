
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

export type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends
    (k: infer I) => void ? I : never;

export type Exact<Constraint, target> =
    (<T>() => T extends Constraint ? 1 : 2) extends
    (<T>() => T extends target ? 1 : 2) ? target : never;
/*
export type IsArgLengthEqual<
    Func extends (...a: any) => any,
    Args extends any[],
    ErrorMessage
> = Parameters<Func>["length"] extends Args["length"] ? {} : ErrorMessage;
 */

// Define a helper to extract all `req` types from a channels object
type ExtractReqs<T> = {
    [K in keyof T]:
        T[K] extends { req: infer Req } ? Req : never;
};

// Define a helper to extract all `res` types from a channels object (optional `res`)
type ExtractRess<T> = {
    [K in keyof T]: T[K] extends { res: infer Res } ? Res : never;
};

// Define the domain function with full inference on RendererToMain and MainToRenderer
function defineDomain<
    Name extends string
>(
    domain: {
        name: Name;
        RendererToMain: {
            sends: Record<`${Name}:${string}`, { req: unknown }>,
            invokes: Record<`${Name}:${string}`, { req: unknown, res: unknown }>
        },
        MainToRenderer: {
            sends: Record<`${Name}:${string}`, { req: unknown}>,
            invokes: Record<`${Name}:${string}`, { req: unknown, res: unknown }>
        }
    }
) {
    return domain;
}

// Example usage:

const testArgObj = {
    name: "test",
    RendererToMain: {
        sends: {
            "test:update": {
                req: {} as { id: string }
            }
        },
        invokes: {
            "test:get": {
                req: {} as { id: string },
                res: {} as { id: string }
            }
        }
    },
    MainToRenderer: {
        sends: {
            "test:notify": {
                req: {} as { id: string }
            }
        },
        invokes: {

        }
    }
};

const myDomain = defineDomain(testArgObj);

// Now extract the `req` and `res` types for RendererToMain channels:
type RendererReqs = ExtractReqs<typeof testArgObj["RendererToMain"]["invokes"]>;
type RendererRess = ExtractRess<typeof testArgObj["MainToRenderer"]["invokes"]>;

// Example of inferred types:
const exampleReq: RendererReqs["test:get"] = { id: "abc" };  // okay
// const exampleReqFail: RendererReqs["test:get"] = { foo: 123 }; // error, foo doesn't exist

const exampleRes: RendererRess["test:get"] = { value: 42 };   // okay
// const exampleResFail: RendererRess["test:get"] = { val: 10 }; // error, property name wrong

// Extract for MainToRenderer similarly:
type MainReqs = ExtractReqs<typeof testArgObj["MainToRenderer"]>;
type MainRess = ExtractRess<typeof testArgObj["MainToRenderer"]>;

// Define a helper to extract all `req` types from a channels object
type ExtractReqs<T extends Record<string, { req: any }>> = {
  [K in keyof T]: T[K] extends { req: infer Req } ? Req : never;
};

// Define a helper to extract all `res` types from a channels object (optional `res`)
type ExtractRess<T extends Record<string, { res?: any }>> = {
    [K in keyof T]: T[K] extends { res: infer Res } ? Res : never;
};

// Define the domain function with full inference on RendererToMain and MainToRenderer
function defineDomain<
    Name extends string,
    RTM extends Record<string, { req: any; res?: any }>,
    MTR extends Record<string, { req: any; res?: any }>
>(domain: {
    name: Name;
    RendererToMain: RTM;
    MainToRenderer: MTR;
}) {
    return domain;
}

// Example usage:

const myDomain = defineDomain({
    name: "test",
    RendererToMain: {
        "test:update": {
            req: {} as { id: string }
        },
        "test:get": {
        req: {} as { id: string },
        res: {} as { value: number }
        }
    },
    MainToRenderer: {
        "test:notify": {
        req: {} as { message: string }
        }
    }
});

// Now extract the `req` and `res` types for RendererToMain channels:
type RendererReqs = ExtractReqs<typeof myDomain["RendererToMain"]>;
type RendererRess = ExtractRess<typeof myDomain["RendererToMain"]>;

// Example of inferred types:
const exampleReq: RendererReqs["test:get"] = { id: "abc" };  // okay
// const exampleReqFail: RendererReqs["test:get"] = { foo: 123 }; // error, foo doesn't exist

const exampleRes: RendererRess["test:get"] = { value: 42 };   // okay
// const exampleResFail: RendererRess["test:get"] = { val: 10 }; // error, property name wrong

// Extract for MainToRenderer similarly:
type MainReqs = ExtractReqs<typeof myDomain["MainToRenderer"]>;
type MainRess = ExtractRess<typeof myDomain["MainToRenderer"]>;

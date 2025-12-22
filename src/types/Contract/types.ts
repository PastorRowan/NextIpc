
// Basic channel shapes
type SendChannel = {
    req: unknown;
};

// 2. Update InvokeChannel with req and res policies
type InvokeChannel = {
    req: unknown;
    res: unknown;
};

export type DirectionType = "RendererToMain" | "MainToRenderer";

export type SendChannels = {
    [key: string]:
        SendChannel
};

export type InvokeChannels = {
    [key: string]:
        InvokeChannel
};

export type Contract = {
    [D in DirectionType]: {
        sends: SendChannels,
        invokes: InvokeChannels
    };
};

/*
interface ContractMapType {
    [key: string]: {
        [D in DirectionType]: {
            sends: {
                [key: string]: {
                    req: unknown,
                    res: unknown
                };
            };
            invokes: {
                [key: string]: {
                    req: unknown,
                    res: unknown
                };
            };
        };
    };
};
*/

export type Channels = SendChannels | InvokeChannels;

/**
 * Shape every domain must conform to
 */
export type ContractMapType = {
    [key: string]:
        Contract
};

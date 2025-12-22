
export type SerializablePrimitive =
    string | number | boolean | null | undefined;

type SerializableArray =
    Serializable[];

type SerializableObject =
    { [key: string]: Serializable };

type Serializable =
    | SerializablePrimitive
    | SerializableArray
    | SerializableObject;

type DefaultPolicy = {
    req: {
        primitive: true;
        array: true;
        object: true
    };
    res: {
        primitive: true;
        array: true;
        object: true
    };
};

export type PolicyOptions = {
    primitive: boolean;
    array: boolean;
    object: boolean;
};

export type Policy = {
    req: PolicyOptions,
    res: PolicyOptions
};

export type AllowedByPolicy<
    P extends PolicyOptions
> =
    // Check if T extends allowed primitive
    | (P["primitive"] extends false ? never : SerializablePrimitive)
    // or T extends allowed array
    | (P["array"] extends false ? never : SerializableArray)
    // or T extends allowed object
    | (P["object"] extends false ? never : SerializableObject);

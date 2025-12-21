
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

type SerializablePrimitive =
    string | number | boolean | null | undefined;

type SerializableArray =
    Serializable[];

type SerializableObject =
    { [key: string]: Serializable };

export type Serializable =
    | SerializablePrimitive
    | SerializableArray
    | SerializableObject;

export type PolicyOptions = {
    primitive?: boolean;
    array?: boolean;
    object?: boolean;
};

export type Policy = {
    req: PolicyOptions,
    res: PolicyOptions
};

export type Allowed<P extends PolicyOptions | undefined> =
    | (P extends { primitive: false } ? never : SerializablePrimitive)
    | (P extends { array: false } ? never : SerializableArray)
    | (P extends { object: false } ? never : SerializableObject);

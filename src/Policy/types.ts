
export type SerializablePrimitive = string | number | boolean | null | undefined;

type SerializableArray = Serializable[];

type SerializableObject = { [key: string]: Serializable };

export type Serializable =
    | SerializablePrimitive
    | SerializableArray
    | SerializableObject;

export type PolicyOptions<
    ObjAllowed extends boolean = boolean,
    ArrayAllowed extends boolean = boolean,
    PrimitiveAllowed extends boolean = boolean
> = {
    object: ObjAllowed;
    array: ArrayAllowed;
    primitive: PrimitiveAllowed;
};

export type Policy<
    ReqPolicyOptions extends PolicyOptions = PolicyOptions,
    ResPolicyOptions extends PolicyOptions = PolicyOptions
> = {
    req: ReqPolicyOptions;
    res: ResPolicyOptions;
};

export type AllowedByPolicy<
    P extends PolicyOptions
> =
    // primitive
    |   (P["primitive"] extends true
            ? SerializablePrimitive
            : never
        )
    |   (P["array"] extends true
            ? SerializableArray
            : never
        )
    |   (P["object"] extends true
            ? SerializableObject
            : never
        );

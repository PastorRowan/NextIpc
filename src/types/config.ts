
import type { NextIpc } from "NextIpc";

type Get<T, K extends PropertyKey> =
    K extends keyof T ? T[K] : never;

export type Config =
    Get<NextIpc, "Config"> extends never
        ? Get<NextIpc, "DefaultConfig">
        : Get<NextIpc, "Config">;

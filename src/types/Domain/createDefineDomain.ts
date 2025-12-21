
import type { Policy } from "./policy";
import type { Domain } from "./gen";

// next-ipc.ts (library code)
export const createDefineDomain =
    <P extends Policy>(policy: P) =>
        <D>(domain: EnforcePolicyOnDomain<D, P>) => domain;

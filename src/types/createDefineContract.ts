
import type {
    Policy,
    AllowedByPolicy
} from "./Policy";
import type {
    Domain,
    DirectionType
} from "./Contract";

// Now the main type that enforces the policy on a Domain:
type EnforcePolicyOnContract<
    D extends Domain,
    P extends Policy
> = {
    [Direction in DirectionType]: {
        sends: {
            [ChannelName in keyof D[Direction]["sends"]]: {
                req: AllowedByPolicy<P["req"]>;
            };
        };
        invokes: {
            [ChannelName in keyof D[Direction]["invokes"]]: {
                req: AllowedByPolicy<P["req"]>;
                res: AllowedByPolicy<P["res"]>;
            };
        };
    };
};

// next-ipc.ts (library code)
export function createDefineDomain<
        P extends Policy
    >({
        policy
    }: {
        policy: P
    }) {
        return {
            defineDomain: function<
                D extends Domain,
                EnforcedContract = EnforcePolicyOnContract<D, P>
                // SatisfiesDomain = Exact<D, EnforcedDomain>
            >(
                domain: D & EnforcedContract
            ): Domain {
                return domain;
            }
        };
    };

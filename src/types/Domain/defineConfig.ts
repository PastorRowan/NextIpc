
import type { Policy } from "./policy";
import type { DomainMapTypeGen } from "./gen";
import type { Exact } from "../utilities";

export function defineConfig<
    P extends Policy,
    DomainMap extends DomainMapType,
    DomainMapType = DomainMapTypeGen<P["req"], P["res"]>,
    PolicySatisfies = Exact<Policy, P>,
    DomainSatisfies = Exact<DomainMapType, DomainMap>
>(config: {
    policy: P & PolicySatisfies;
    domains: DomainMap & DomainSatisfies;
}): {
    policy: P;
    domains: DomainMap;
} {
    return config;
};

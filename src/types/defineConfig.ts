
import type { DomainMapType } from "./Contract";
import type { Exact } from "./utilities";

export function defineConfig<
    DomainMap extends DomainMapType,
    DomainSatisfies = Exact<DomainMapType, DomainMap>
>(
    config: DomainMap & DomainSatisfies
) {
    return config;
};

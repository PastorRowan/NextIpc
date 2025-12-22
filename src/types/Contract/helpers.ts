
import type { UnionToIntersection } from "../utilities/utilities";
import type {
    Channels,
    DirectionType,
    ContractMapType
} from "./types";

// Utility to get args tuple type from the req property
export type ArgsOfChannel<ChannelsP extends Channels, ChannelName extends keyof ChannelsP> =
    ChannelsP[ChannelName]["req"] extends any[]
        ? ChannelsP[ChannelName]["req"]
        : [ChannelsP[ChannelName]["req"]];

export type Domains<
    DomainMap extends DomainMapType
> = 

// Helper type to get only the 'invoke' channels for a given direction across all domains
export type FlatInvokeChannels<
    Direction extends DirectionType,
    Domains extends DomainMapType
> = UnionToIntersection<Domains[keyof Domains][Direction]["invokes"]>;


import type { Policy } from "./policy";
import type {
    DomainMapTypeGen,
    ChannelsGen,
    SendChannelsGen,
    InvokeChannelsGen
} from "./gen";

export type { DirectionType } from "./gen";

export type {
    FlatSendChannels,
    FlatInvokeChannels
} from "./helpers";

export type SendChannels = SendChannelsGen<
    Policy["req"]
>;

export type InvokeChannels = InvokeChannelsGen<
    Policy["req"],
    Policy["res"]
>;

export type Channels = ChannelsGen<
    Policy["req"],
    Policy["res"]
>;

export type DomainMapType = DomainMapTypeGen<
    Policy["req"],
    Policy["res"]
>;

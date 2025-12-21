
import { Config } from "../config";
import {
    FlatSendChannels,
    FlatInvokeChannels,
} from "./helpers";

export type { Policy } from "./policy";

export { defineConfig } from "./defineConfig";

export type { Serializable } from "./policy";

export type { ArgsOfChannel } from "./helpers";

export type RendererToMainSendChannels = FlatSendChannels<"RendererToMain", Config["domains"]>;

export type RendererToMainInvokeChannels = FlatInvokeChannels<"RendererToMain", Config["domains"]>;

export type MainToRendererSendChannels = FlatSendChannels<"MainToRenderer", Config["domains"]>;


import { defaultConfig } from "./defaultConfig";

// index.ts

export { defineConfig } from "./types";

export interface NextIpc {
    DefaultConfig: typeof defaultConfig;
};

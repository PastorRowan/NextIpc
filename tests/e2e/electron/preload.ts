
// preload.js
import { contextBridge } from "electron";
import { exposeInMainWorld } from "../../../dist/preload/index.js";

exposeInMainWorld(contextBridge);

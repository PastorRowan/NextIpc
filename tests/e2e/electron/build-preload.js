
// build-preload.js
import esbuild from "esbuild";
import path from "path";
import { fileURLToPath } from "url";

// __dirname replacement in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

esbuild.build({
    entryPoints: [path.resolve(__dirname, "preload.ts")], // adjust this to your preload source
    outfile:
        path.resolve(
            __dirname, "..", "..", "..", "dist-tests", "e2e", "electron", "preload.bundle.js"
        ),    // output file for preload script
    bundle: true,
    platform: "node",       // since Electron preload runs in Node context (mostly)
    format: "cjs",          // CommonJS format required by preload
    sourcemap: true,        // optional, helpful for debugging
    target: ["es2020"],     // modern enough target for Electron
    external: ["electron"], // exclude electron module from bundling
}).catch(() => process.exit(1));


// build-preload.js
import esbuild from "esbuild";
import path from "path";

function getNamedArg(name) {
    const index = process.argv.indexOf(`--${name}`);
    return index !== -1 ? process.argv[index + 1] : null;
};

const entryFileArg = getNamedArg("src");

if (!entryFileArg) {
    throw new Error("Missing required CLI argument: --src");
};

const outFileArg = getNamedArg("out");

if (!outFileArg) {
    throw new Error("Missing required CLI argument: --out");
};

const externalArg = getNamedArg("external");

const externals = externalArg
    ? externalArg.split(",").map(s => s.trim())
    : [];

const cwd = process.cwd();
const entryFile = path.resolve(cwd, entryFileArg);
const outFile = path.resolve(cwd, outFileArg);

esbuild.build({
    entryPoints: [entryFile], // adjust this to your preload source
    outfile: outFile,    // output file for preload script
    bundle: true,
    platform: "node",       // since Electron preload runs in Node context (mostly)
    format: "cjs",          // CommonJS format required by preload
    sourcemap: true,        // optional, helpful for debugging
    target: ["es2020"],     // modern enough target for Electron
    external: externals, // exclude electron module from bundling
}).catch(function(err) {
    console.error(err);
    process.exit(1);
});

/*
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
*/


import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ESM __filename and __dirname equivalents
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function copyFile(srcFile, destFile) {
    await fs.mkdir(path.dirname(destFile), { recursive: true });
    await fs.copyFile(srcFile, destFile);
    console.log(`Copied ${srcFile} -> ${destFile}`);
};

async function copyStaticFiles(srcDir, outDir, extensions = [".html", ".css", ".png", ".jpg"]) {
    async function walk(dir) {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                await walk(fullPath);
            } else {
                if (extensions.includes(path.extname(entry.name))) {
                const relativePath = path.relative(srcDir, fullPath);
                const destPath = path.join(outDir, relativePath);
                await copyFile(fullPath, destPath);
                };
            };
        };
    };

    await walk(srcDir);
};

/*
// Usage: adjust these paths as needed
const srcFolder = path.resolve(__dirname);
const outFolder = path.resolve(__dirname, "..","dist-tests");
*/

/*
    Read CLI arguments:
    src: 
    out: 
*/

function getNamedArg(name) {
    const index = process.argv.indexOf(`--${name}`);
    return index !== -1 ? process.argv[index + 1] : null;
};

const srcArg = getNamedArg("src");
const outArg = getNamedArg("out");

if (!srcArg) {
    throw new Error("Missing required CLI argument: --src");
};

if (!outArg) {
    throw new Error("Missing required CLI argument: --out");
};

const cwd = process.cwd();
const srcFolder = path.resolve(cwd, srcArg);
const outFolder = path.resolve(cwd, outArg);

(async function main() {
    try {
        await copyStaticFiles(srcFolder, outFolder);
        console.log("Finished copying static files");
    } catch (err) {
        console.error("Error copying static files:", err);
        process.exit(1);
    };
})();

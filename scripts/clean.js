
import path from "path";
import fs from "fs/promises";

// Read CLI argument (node clean.js <dir>)
const dirArg = process.argv[2];

if (
    dirArg === "" ||
    dirArg === undefined ||
    dirArg === null
) {
    throw new Error("Directory CLI arguement is empty");
};

const cwd = process.cwd();

// Resolve target directory relative to current working directory (cwd)
const targetDir = path.resolve(cwd, dirArg);

// Define project root as cwd
const projectRoot = cwd;

async function validateTargetDir(dir) {

    if (typeof dir !== "string") {
        throw new Error(`dir is not a string: ${dir}`);
    };

    // Must be inside project root
    const relative = path.relative(projectRoot, dir);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
        throw new Error(`Refusing to delete outside project root: ${dir}`);
    };

    // Must exist
    let stat;
    try {
        stat = await fs.stat(dir);
    } catch {
        // Recreate the directory empty
        await fs.mkdir(targetDir);
        console.log(`Recreated empty folder: ${targetDir}`);
        throw new Error(`Directory does not exist: ${dir}`);
    };

    // Must be a directory
    if (!stat.isDirectory()) {
        throw new Error(`Target is not a directory: ${dir}`);
    };

};

(async function main() {

    try {

        await validateTargetDir(targetDir);

        // Remove the directory recursively
        await fs.rm(targetDir, {
            recursive: true,
            force: true
        });
        console.log(`Deleted folder: ${targetDir}`);

        // Recreate the directory empty
        await fs.mkdir(targetDir);
        console.log(`Recreated empty folder: ${targetDir}`);

    } catch (err) {
        console.error("Failed to delete dist folder:", err);
        process.exit(1);
    };

})();

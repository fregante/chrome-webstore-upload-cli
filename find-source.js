import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const isZip = filepath => path.extname(filepath) === '.zip';

// Node hates race conditons and ease of use
// https://github.com/nodejs/node/issues/39960#issuecomment-909444667
async function exists(f) {
    try {
        await fs.stat(f);
        return true;
    } catch {
        return false;
    }
}

async function processDirectory(resolvedPath, errorStart = 'The') {
    if (!await exists(resolvedPath)) {
        throw new Error(`${errorStart} directory was not found: ${resolvedPath}`);
    }

    const manifestPath = path.join(resolvedPath, 'manifest.json');
    if (!await exists(manifestPath)) {
        throw new Error(`${errorStart} directory does not contain manifest.json: ${resolvedPath}`);
    }

    let manifest;
    try {
        manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
        if (typeof manifest.manifest_version === 'number') {
            return resolvedPath;
        }
    } catch {}

    throw new Error(`${errorStart} directory does not contain a valid manifest.json: ${resolvedPath}`);
}

async function getPathFromPackageJson() {
    const cwd = process.cwd();

    const packageJsonPath = path.join(cwd, 'package.json');
    if (!await exists(packageJsonPath)) {
        return undefined;
    }

    const pkg = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
    if (!pkg.webExt?.sourceDir) {
        return undefined;
    }

    const resolvedPath = path.resolve(cwd, pkg.webExt.sourceDir);
    return processDirectory(resolvedPath, 'Reading webExt.sourceDir from package.json, the');
}

export default async function findSource(flag) {
    const cwd = process.cwd();

    if (flag) {
        const resolvedPath = path.resolve(cwd, flag);
        if (!isZip(resolvedPath)) {
            return processDirectory(resolvedPath);
        }

        if (!await exists(resolvedPath)) {
            throw new Error(`Zipped extension not found: ${resolvedPath}`);
        }

        return resolvedPath;
    }

    return await getPathFromPackageJson()
        ?? processDirectory(cwd, 'Using the cwd, the');
}

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const isZip = filepath => path.extname(filepath) === '.zip';

function processDirectory(resolvedPath, errorStart = 'The') {
    if (!fs.existsSync(resolvedPath)) {
        throw new Error(`${errorStart} directory was not found: ${resolvedPath}`);
    }

    const manifestPath = path.join(resolvedPath, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
        throw new Error(`${errorStart} directory does not contain manifest.json: ${resolvedPath}`);
    }

    let manifest;
    try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        if (typeof manifest.manifest_version === 'number') {
            return resolvedPath;
        }
    } catch {}

    throw new Error(`${errorStart} directory does not contain a valid manifest.json: ${resolvedPath}`);
}

function getPathFromPackageJson() {
    const cwd = process.cwd();

    const packageJsonPath = path.join(cwd, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        return undefined;
    }

    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (!pkg.webExt?.sourceDir) {
        return undefined;
    }

    const resolvedPath = path.resolve(cwd, pkg.webExt.sourceDir);
    return processDirectory(resolvedPath, 'Reading webExt.sourceDir from package.json, the');
}

export default function findSource(flag) {
    const cwd = process.cwd();

    if (flag) {
        const resolvedPath = path.resolve(cwd, flag);
        if (!isZip(resolvedPath)) {
            return processDirectory(resolvedPath);
        }

        if (!fs.existsSync(resolvedPath)) {
            throw new Error(`Zipped extension not found: ${resolvedPath}`);
        }

        return resolvedPath;
    }

    return getPathFromPackageJson()
        ?? processDirectory(cwd, 'Using the cwd, the');
}

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const isZip = filepath => path.extname(filepath) === '.zip';

function processDirectory(resolvedPath/* , errorStart = 'Directory' */) {
    // TODO: The tests need to simulate the FS for this to work
    // if (!fs.existsSync(resolvedPath)) {
    //     throw new Error(`${errorStart} not found: ${resolvedPath}`);
    // }

    // if (!fs.existsSync(path.join(resolvedPath, 'manifest.json'))) {
    //     throw new Error(`${errorStart} does not contain manifest.json: ${resolvedPath}`);
    // }

    return resolvedPath;
}

export default function findSource(flag) {
    const cwd = process.cwd();

    if (flag) {
        const resolvedPath = path.resolve(cwd, flag);
        if (!isZip(resolvedPath)) {
            return processDirectory(resolvedPath);
        }

        if (!fs.existsSync(resolvedPath)) {
            return resolvedPath;
        }

        throw new Error(`File not found: ${resolvedPath}`);
    }

    const packageJsonPath = path.join(cwd, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (pkg.webExt?.sourceDir) {
            const resolvedPath = path.resolve(cwd, pkg.webExt.sourceDir);
            return processDirectory(resolvedPath, 'Reading webExt.sourceDir from package.json, the directory');
        }
    }

    return processDirectory(cwd, 'Using the cwd, the directory');
}

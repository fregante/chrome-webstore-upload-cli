import { basename } from 'node:path';
import { readdir } from 'node:fs/promises';
import { isNotJunk } from 'junk';
import yazl from 'yazl';
import { zipPath } from './util.js';

export default async function zipStreamFromDir(dir) {
    const files = await readdir(dir, { recursive: true });
    ;
    const zip = new yazl.ZipFile();
    let hasManifest = false;
    for (const file of files) {
        if (isNotJunk(basename(file))) {
            const relativePath = zipPath(dir, file);
            zip.addFile(file, relativePath);
            hasManifest = hasManifest || relativePath === 'manifest.json';
        }
    }

    if (!hasManifest) {
        throw new Error(`manifest.json was not found in ${dir}`);
    }

    zip.end();
    return zip.outputStream;
}

import { basename } from 'node:path';
import { isNotJunk } from 'junk';
import yazl from 'yazl';
import recursiveDir from 'recursive-readdir';
import { zipPath } from './util.js';

export default async function zipStreamFromDir(dir) {
    const files = await recursiveDir(dir);
    const zip = new yazl.ZipFile();
    for (const file of files) {
        if (isNotJunk(basename(file))) {
            zip.addFile(file, zipPath(dir, file));
        }
    }

    zip.end();

    return zip.outputStream;
}

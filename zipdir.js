import { basename } from 'node:path';
import { isNotJunk } from 'junk';
import yazl from 'yazl';
import recursiveDir from 'recursive-readdir';
import { zipPath } from './util.js';

export default function zipStreamFromDir(dir) {
    return recursiveDir(dir).then(files => {
        const zip = new yazl.ZipFile();
        for (const file of files) {
            if (isNotJunk(basename(file))) {
                zip.addFile(file, zipPath(dir, file));
            }
        }

        return new Promise(resolve => {
            zip.end(() => {
                resolve(zip.outputStream);
            });
        });
    });
}

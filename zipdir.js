const { basename } = require('path');
const junk = require('junk');
const yazl = require('yazl');
const pify = require('pify');
const recursiveDir = require('recursive-readdir');
const { zipPath } = require('./util');

module.exports = function zipStreamFromDir(dir) {
    return pify(recursiveDir)(dir).then(files => {
        const zip = new yazl.ZipFile();
        for (const file of files) {
            if (junk.is(basename(file))) {
                continue;
            }

            zip.addFile(file, zipPath(dir, file));
        }

        return new Promise(resolve => {
            zip.end(() => {
                resolve(zip.outputStream);
            });
        });
    });
};

const base = require('path').basename;
const junk = require('junk');
const yazl = require('yazl');
const pify = require('pify');
const zipPath = require('./util').zipPath;
const recursiveDir = require('recursive-readdir');

module.exports = function zipStreamFromDir(dir) {
    return pify(recursiveDir)(dir).then(files => {
        const zip = new yazl.ZipFile();
        files.forEach(file => {
            if (junk.is(base(file))) return;
            zip.addFile(file, zipPath(dir, file));
        });

        return new Promise((res, rej) => {
            zip.end(() => {
                res(zip.outputStream);
            });
        });
    });
};

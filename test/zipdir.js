import test from 'ava';
import recursiveDir from 'recursive-readdir';
import { ZipFile } from 'yazl';
import { isReadableStream } from 'is-stream';
import zipdir from '../zipdir.js';

function stubAddFile(stub) {
    const old = ZipFile.prototype.addFile;
    ZipFile.prototype.addFile = stub;

    return () => {
        ZipFile.prototype.addFile = old;
    };
}

function getExtensionFixtureFiles(name) {
    return recursiveDir(`./test/fixtures/${name}`);
}

test('Rejects when provided invalid dir', async t => {
    await t.throwsAsync(zipdir('foo'));
});

test('Rejects when the manifest isn’t found', async t => {
    await t.throwsAsync(zipdir('./test/fixtures/wrong-folder'));
});

test('Resolves to a readable stream', async t => {
    const shouldBeStream = await zipdir('./test/fixtures/without-junk');
    t.true(isReadableStream(shouldBeStream));
});

test.serial('Adds each file in dir', async t => {
    const files = await getExtensionFixtureFiles('without-junk');
    t.plan(files.length);

    const resetStub = stubAddFile(() => t.pass());

    await zipdir('./test/fixtures/without-junk');
    resetStub();
});

test.serial('Ignores OS junk files', async t => {
    const junkFiles = [
        '.DS_STORE',
        'Thumbs.db',
    ];
    const files = await getExtensionFixtureFiles('with-junk');
    t.plan(files.length - junkFiles.length);

    const resetStub = stubAddFile(() => t.pass());

    await zipdir('./test/fixtures/with-junk');
    resetStub();
});

test('Removes user-supplied root from path in zip', t => {
    const zip = new ZipFile();
    zip.addFile('./test/fixtures/without-junk/manifest.json', 'manifest.json');
    zip.end();

    return new Promise(resolve => {
        zip.outputStream.on('data', data => {
            t.false(data.toString().includes('without-junk'));
            resolve();
        });
    });
});

import test from 'ava';
import pify from 'pify';
import zipdir from '../zipdir';
import { ZipFile } from 'yazl';
import { readable } from 'is-stream';
import recursiveDir from 'recursive-readdir';

function stubAddFile(stub) {
    const old = ZipFile.prototype.addFile;
    ZipFile.prototype.addFile = stub;

    return () => ZipFile.prototype.addFile = old;
}

function getExtensionFixtureFiles(name) {
    return pify(recursiveDir)(`./fixtures/${name}`);
}

test('Rejects when provided invalid dir', async t => {
    try {
        await zipdir('foo');
        t.fail('Did not reject');
    } catch(e) {
        t.pass('Rejected');
    }
});

test('Resolves to a readable stream', async t => {
    const shouldBeStream = await zipdir('fixtures/without-junk');
    t.true(readable(shouldBeStream));
});

test.serial('Adds each file in dir', async t => {
    const files = await getExtensionFixtureFiles('without-junk');
    t.plan(files.length);

    const resetStub = stubAddFile(() => t.pass());

    await zipdir('fixtures/without-junk');
    resetStub();
});

test.serial('Ignores OS junk files', async t => {
    const junkFiles = [
        '.DS_STORE',
        'Thumbs.db'
    ];
    const files = await getExtensionFixtureFiles('with-junk');
    t.plan(files.length - junkFiles.length);

    const resetStub = stubAddFile(() => t.pass());

    await zipdir('fixtures/with-junk');
    resetStub();
});

test.todo('Removes user-supplied root from path in zip');

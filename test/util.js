import test from 'ava';
import { isUploadSuccess,
    zipPath } from '../util.js';

test('isUploadSuccess', t => {
    t.true(isUploadSuccess({
        uploadState: 'SUCCESS',
    }));
});

test('zipPath', t => {
    const pathMappings = [{
        root: 'extension',
        file: 'extension/manifest.json',
        expected: 'manifest.json',
    }, {
        root: 'extension/',
        file: 'extension/foo/bar',
        expected: 'foo/bar',
    }, {
        root: '.',
        file: './manifest.json',
        expected: 'manifest.json',
    }, {
        root: 'extension/foo',
        file: 'extension/foo/manifest.json',
        expected: 'manifest.json',
    }, {
        root: 'extension/foo',
        file: 'extension/foo/bar/biz',
        expected: 'bar/biz',
    }];

    for (const { root, file, expected } of pathMappings) {
        t.is(zipPath(root, file), expected);
    }
});

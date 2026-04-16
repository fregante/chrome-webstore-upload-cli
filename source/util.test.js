import test from 'ava';
import {
    isArchive,
    isUploadSuccess,
} from './util.js';

test('isArchive', t => {
    t.true(isArchive('extension.zip'));
    t.true(isArchive('extension.crx'));
    t.false(isArchive('extension.txt'));
    t.false(isArchive('directory'));
});

test('isUploadSuccess', t => {
    t.true(isUploadSuccess({
        uploadState: 'SUCCESS',
    }));
});

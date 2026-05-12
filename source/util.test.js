import test from 'ava';
import {
    isArchive,
    isUploadSuccess,
    handlePublishStatus,
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

test('handlePublishStatus logs success when state is PUBLISHED', t => {
    const logs = [];
    const restoreLog = console.log;
    console.log = message => {
        logs.push(message);
    };

    handlePublishStatus({ state: 'PUBLISHED' });

    console.log = restoreLog;
    t.deepEqual(logs, ['Publish successful']);
});

test('handlePublishStatus throws for non-PUBLISHED state', t => {
    const item = { state: 'REVIEW_IN_PROGRESS' };
    const error = t.throws(() => {
        handlePublishStatus(item);
    });
    t.is(error.message, 'Unexpected publish state: REVIEW_IN_PROGRESS');
});

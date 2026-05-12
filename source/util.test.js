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
    t.deepEqual(logs, ['Published successfully']);
});

test('handlePublishStatus logs when state is PUBLISHED_TO_TESTERS', t => {
    const logs = [];
    const restoreLog = console.log;
    console.log = message => {
        logs.push(message);
    };

    handlePublishStatus({ state: 'PUBLISHED_TO_TESTERS' });

    console.log = restoreLog;
    t.deepEqual(logs, ['Published to trusted testers']);
});

test('handlePublishStatus logs when state is PENDING_REVIEW', t => {
    const logs = [];
    const restoreLog = console.log;
    console.log = message => {
        logs.push(message);
    };

    handlePublishStatus({ state: 'PENDING_REVIEW' });

    console.log = restoreLog;
    t.deepEqual(logs, ['Pending review']);
});

test('handlePublishStatus logs when state is STAGED', t => {
    const logs = [];
    const restoreLog = console.log;
    console.log = message => {
        logs.push(message);
    };

    handlePublishStatus({ state: 'STAGED' });

    console.log = restoreLog;
    t.deepEqual(logs, ['Staged and ready to publish']);
});

test('handlePublishStatus logs when state is CANCELLED', t => {
    const logs = [];
    const restoreLog = console.log;
    console.log = message => {
        logs.push(message);
    };

    handlePublishStatus({ state: 'CANCELLED' });

    console.log = restoreLog;
    t.deepEqual(logs, ['Submission was cancelled']);
});

test('handlePublishStatus throws for REJECTED state', t => {
    const error = t.throws(() => {
        handlePublishStatus({ state: 'REJECTED' });
    });
    t.is(error.message, 'Publish rejected');
});

test('handlePublishStatus logs unknown state without throwing', t => {
    const logs = [];
    const restoreLog = console.log;
    console.log = message => {
        logs.push(message);
    };

    handlePublishStatus({ state: 'SOME_UNKNOWN_STATE' });

    console.log = restoreLog;
    t.deepEqual(logs, ['Publish state: SOME_UNKNOWN_STATE']);
});

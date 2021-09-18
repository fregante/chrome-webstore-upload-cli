const test = require('ava');
const util = require('../util');
const stubs = require('./helpers/stubs');

const { stubProcessExit, stubConsoleLog } = stubs;

test('isUploadSuccess', t => {
    t.true(util.isUploadSuccess({
        uploadState: 'SUCCESS',
    }));
});

test('exitWithUploadFailure', t => {
    t.plan(3);

    const errorCode = 1;
    const errorDetail = 'This is detailed!';

    const resetExit = stubProcessExit(code => t.is(code, 1));
    const resetLog = stubConsoleLog(value => {
        if (value === `Error Code: ${errorCode}`) {
            t.pass('Error code');
        }

        if (value === `Details: ${errorDetail}`) {
            t.pass('Error details');
        }
    });

    util.exitWithUploadFailure({
        itemError: [{
            error_code: errorCode,
            error_detail: errorDetail,
        }],
    });

    resetExit();
    resetLog();
});

test('exitWithPublishStatus', t => {
    t.plan(2);

    const status = 'Success';

    const resetExit = stubProcessExit(code => t.is(code, 0));
    const resetLog = stubConsoleLog(value => {
        if (value === `Publish Status: ${status}`) {
            t.pass('Publish Status');
        }
    });

    util.exitWithPublishStatus({
        status: [status],
    });

    resetExit();
    resetLog();
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
        t.is(util.zipPath(root, file), expected);
    }
});

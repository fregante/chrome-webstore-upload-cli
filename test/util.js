import test from 'ava';
import util from '../util';
import stubs from './helpers/stubs';

const { stubProcessExit, stubConsoleLog } = stubs;

test('isUploadSuccess', t => {
    t.true(util.isUploadSuccess({
        uploadState: 'SUCCESS'
    }));
});

test('exitWithUploadFailure', t => {
    t.plan(3);

    const errorCode = 1;
    const errorDetail = 'This is detailed!';

    const resetExit = stubProcessExit(code => t.is(code, 1));
    const resetLog = stubConsoleLog(val => {
        if (val === `Error Code: ${errorCode}`) {
            t.pass('Error code');
        }

        if (val === `Details: ${errorDetail}`) {
            t.pass('Error details');
        }
    });

    util.exitWithUploadFailure({
        itemError: [{
            error_code: errorCode,
            error_detail: errorDetail
        }]
    });

    resetExit();
    resetLog();
});

test('exitWithPublishStatus', t => {
    t.plan(2);

    const status = 'Success';

    const resetExit = stubProcessExit(code => t.is(code, 0));
    const resetLog = stubConsoleLog(val => {
        if (val === `Publish Status: ${status}`) {
            t.pass('Publish Status');
        }
    });

    util.exitWithPublishStatus({
        status: [status]
    });

    resetExit();
    resetLog();
});

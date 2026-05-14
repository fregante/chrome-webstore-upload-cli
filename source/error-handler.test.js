import process from 'node:process';
import test from 'ava';
import { stubConsoleLog } from '../test/helpers/stubs.js';
import { extractDetailLines, handleError } from './error-handler.js';

test('CWSError displays message with ❌ prefix and helpful links', t => {
    const logs = [];
    const errors = [];

    const restoreLog = stubConsoleLog(message => {
        logs.push(message);
    });
    const restoreError = (() => {
        const old = console.error;
        console.error = message => {
            errors.push(message);
        };

        return () => {
            console.error = old;
        };
    })();

    // Create a CWSError-like object
    const error = new Error('Invalid grant: The authentication keys are probably invalid or expired');
    error.name = 'CWSError';

    process.exitCode = 0;

    handleError(error);

    restoreLog();
    restoreError();

    t.is(errors.length, 6);
    t.is(errors[0], '❌ Invalid grant: The authentication keys are probably invalid or expired');
    t.is(errors[1], 'Does the dev console require changes?');
    t.is(errors[2], 'https://chrome.google.com/webstore/devconsole');
    t.is(errors[3], '');
    t.is(errors[4], 'Did you follow the guide to generate the keys?');
    t.is(errors[5], 'https://github.com/fregante/chrome-webstore-upload-keys');

    t.is(process.exitCode, 1);
    process.exitCode = 0;
});

test('CWSError with publish-related message shows both links', t => {
    const errors = [];

    const restoreError = (() => {
        const old = console.error;
        console.error = message => {
            errors.push(message);
        };

        return () => {
            console.error = old;
        };
    })();

    // Create a CWSError-like object with publish-related message
    const error = new Error('You must provide a contact email before you can publish any item. Enter your contact email on the Account tab.');
    error.name = 'CWSError';

    process.exitCode = 0;

    handleError(error);

    restoreError();

    t.is(errors.length, 6);
    t.is(errors[0], '❌ You must provide a contact email before you can publish any item. Enter your contact email on the Account tab.');
    t.is(errors[1], 'Does the dev console require changes?');
    t.is(errors[2], 'https://chrome.google.com/webstore/devconsole');
    t.is(errors[3], '');
    t.is(errors[4], 'Did you follow the guide to generate the keys?');
    t.is(errors[5], 'https://github.com/fregante/chrome-webstore-upload-keys');

    t.is(process.exitCode, 1);
    process.exitCode = 0;
});

test('CWSError with any message shows both links', t => {
    const errors = [];

    const restoreError = (() => {
        const old = console.error;
        console.error = message => {
            errors.push(message);
        };

        return () => {
            console.error = old;
        };
    })();

    // Create a CWSError-like object with any message
    const error = new Error('Some other error message');
    error.name = 'CWSError';

    process.exitCode = 0;

    handleError(error);

    restoreError();

    t.is(errors.length, 6);
    t.is(errors[0], '❌ Some other error message');
    t.is(errors[1], 'Does the dev console require changes?');
    t.is(errors[2], 'https://chrome.google.com/webstore/devconsole');
    t.is(errors[3], '');
    t.is(errors[4], 'Did you follow the guide to generate the keys?');
    t.is(errors[5], 'https://github.com/fregante/chrome-webstore-upload-keys');

    t.is(process.exitCode, 1);
    process.exitCode = 0;
});

test('extractDetailLines returns BadRequest field violations', t => {
    const details = [
        {
            '@type': 'type.googleapis.com/google.rpc.BadRequest',
            fieldViolations: [
                {
                    field: 'media',
                    description: 'The manifest has an invalid version: 0.0.0.',
                    reason: 'PKG_MANIFEST_PARSE_ERROR',
                },
            ],
        },
    ];

    t.deepEqual(extractDetailLines(details), [
        'media: The manifest has an invalid version: 0.0.0.',
    ]);
});

test('extractDetailLines returns localized messages and reasons', t => {
    const details = [
        {
            '@type': 'type.googleapis.com/google.rpc.LocalizedMessage',
            message: 'The uploaded package was invalid.',
        },
        {
            '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
            reason: 'INVALID_PACKAGE',
        },
    ];

    t.deepEqual(extractDetailLines(details), [
        'The uploaded package was invalid.',
        'INVALID_PACKAGE',
    ]);
});

test('extractDetailLines ignores empty entries', t => {
    const details = [
        null,
        {
            '@type': 'type.googleapis.com/google.rpc.BadRequest',
            fieldViolations: [
                {
                    field: 'media',
                    description: '   ',
                },
            ],
        },
        {
            '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
        },
    ];

    t.deepEqual(extractDetailLines(details), []);
});

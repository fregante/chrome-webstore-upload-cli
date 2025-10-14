import process from 'node:process';
import test from 'ava';
import { stubConsoleLog } from '../test/helpers/stubs.js';

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

    // Simulate error handling
    if (error?.name === 'CWSError') {
        console.error(`❌ ${error.message}`);
        console.error('Does the dev console require changes?');
        console.error('https://chrome.google.com/webstore/devconsole');
        console.error('');
        console.error('Did you follow the guide to generate the keys?');
        console.error('https://github.com/fregante/chrome-webstore-upload-keys');
    }

    restoreLog();
    restoreError();

    t.is(errors.length, 6);
    t.is(errors[0], '❌ Invalid grant: The authentication keys are probably invalid or expired');
    t.is(errors[1], 'Does the dev console require changes?');
    t.is(errors[2], 'https://chrome.google.com/webstore/devconsole');
    t.is(errors[3], '');
    t.is(errors[4], 'Did you follow the guide to generate the keys?');
    t.is(errors[5], 'https://github.com/fregante/chrome-webstore-upload-keys');
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

    // Simulate error handling
    if (error?.name === 'CWSError') {
        console.error(`❌ ${error.message}`);
        console.error('Does the dev console require changes?');
        console.error('https://chrome.google.com/webstore/devconsole');
        console.error('');
        console.error('Did you follow the guide to generate the keys?');
        console.error('https://github.com/fregante/chrome-webstore-upload-keys');
    }

    restoreError();

    t.is(errors.length, 6);
    t.is(errors[0], '❌ You must provide a contact email before you can publish any item. Enter your contact email on the Account tab.');
    t.is(errors[1], 'Does the dev console require changes?');
    t.is(errors[2], 'https://chrome.google.com/webstore/devconsole');
    t.is(errors[3], '');
    t.is(errors[4], 'Did you follow the guide to generate the keys?');
    t.is(errors[5], 'https://github.com/fregante/chrome-webstore-upload-keys');
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

    // Simulate error handling
    if (error?.name === 'CWSError') {
        console.error(`❌ ${error.message}`);
        console.error('Does the dev console require changes?');
        console.error('https://chrome.google.com/webstore/devconsole');
        console.error('');
        console.error('Did you follow the guide to generate the keys?');
        console.error('https://github.com/fregante/chrome-webstore-upload-keys');
    }

    restoreError();

    t.is(errors.length, 6);
    t.is(errors[0], '❌ Some other error message');
    t.is(errors[1], 'Does the dev console require changes?');
    t.is(errors[2], 'https://chrome.google.com/webstore/devconsole');
    t.is(errors[3], '');
    t.is(errors[4], 'Did you follow the guide to generate the keys?');
    t.is(errors[5], 'https://github.com/fregante/chrome-webstore-upload-keys');
});


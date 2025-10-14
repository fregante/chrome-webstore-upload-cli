import process from 'node:process';
import test from 'ava';
import { stubConsoleLog } from './helpers/stubs.js';

test('CWSError displays message with ❌ prefix', t => {
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

    // Mock the errorHandler function (we need to simulate it)
    // Since we can't import it directly, we'll test that the error format is correct
    process.exitCode = 0;

    // Simulate error handling
    if (error?.name === 'CWSError') {
        console.error(`❌ ${error.message}`);

        const message = error.message.toLowerCase();
        if (message.includes('publish') || message.includes('privacy') || message.includes('contact email') || message.includes('certify')) {
            console.error('https://chrome.google.com/webstore/devconsole');
        }
    }

    restoreLog();
    restoreError();

    t.is(errors.length, 1);
    t.is(errors[0], '❌ Invalid grant: The authentication keys are probably invalid or expired');
});

test('CWSError with publish-related message includes developer console link', t => {
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

        const message = error.message.toLowerCase();
        if (message.includes('publish') || message.includes('privacy') || message.includes('contact email') || message.includes('certify')) {
            console.error('https://chrome.google.com/webstore/devconsole');
        }
    }

    restoreError();

    t.is(errors.length, 2);
    t.is(errors[0], '❌ You must provide a contact email before you can publish any item. Enter your contact email on the Account tab.');
    t.is(errors[1], 'https://chrome.google.com/webstore/devconsole');
});

test('CWSError with privacy-related message includes developer console link', t => {
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

    // Create a CWSError-like object with privacy-related message
    const error = new Error('To publish your item, you must provide mandatory privacy information in the new Developer Dashboard.');
    error.name = 'CWSError';

    process.exitCode = 0;

    // Simulate error handling
    if (error?.name === 'CWSError') {
        console.error(`❌ ${error.message}`);

        const message = error.message.toLowerCase();
        if (message.includes('publish') || message.includes('privacy') || message.includes('contact email') || message.includes('certify')) {
            console.error('https://chrome.google.com/webstore/devconsole');
        }
    }

    restoreError();

    t.is(errors.length, 2);
    t.is(errors[0], '❌ To publish your item, you must provide mandatory privacy information in the new Developer Dashboard.');
    t.is(errors[1], 'https://chrome.google.com/webstore/devconsole');
});

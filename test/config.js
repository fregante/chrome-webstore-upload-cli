import process from 'node:process';
import test from 'ava';
import createConfig from '../config.js';
import { mockFileSystem } from './helpers/stubs.js';

mockFileSystem();

test('Extension ID flag takes precedence over env var', async t => {
    process.env.EXTENSION_ID = 123;
    const expectedId = 456;
    const config = await createConfig(null, { extensionId: expectedId });

    t.is(config.apiConfig.extensionId, expectedId);
    delete process.env.EXTENSION_ID;
});

test('All options supported as env vars', async t => {
    const vars = [
        'EXTENSION_ID',
        'CLIENT_ID',
        'CLIENT_SECRET',
        'REFRESH_TOKEN',
    ];
    const varsValue = '123';

    for (const name of vars) {
        process.env[name] = varsValue;
    }

    const config = await createConfig(null, {});
    t.is(config.apiConfig.extensionId, varsValue);
    t.is(config.apiConfig.clientId, varsValue);
    t.is(config.apiConfig.clientSecret, varsValue);
    t.is(config.apiConfig.refreshToken, varsValue);

    for (const name of vars) {
        delete process.env[name];
    }
});

test('Upload', async t => {
    const config = await createConfig('upload', {});

    t.true(config.isUpload);
    t.false(config.isPublish);
    t.truthy(config.path);
    t.is(config.maxAwaitInProgress, 300);
});

test('Upload wait in progress', async t => {
    const config = await createConfig('upload', { maxAwaitInProgress: 30 });

    t.true(config.isUpload);
    t.false(config.isPublish);
    t.truthy(config.path);
    t.is(config.maxAwaitInProgress, 30);
});

test('Upload defaults to waiting in progress', async t => {
    const config = await createConfig('upload', {});

    t.true(config.isUpload);
    t.false(config.isPublish);
    t.truthy(config.path);
    t.is(config.maxAwaitInProgress, 300);
});

test('Publish', async t => {
    const config = await createConfig('publish', {});

    t.true(config.isPublish);
    t.false(config.isUpload);
    t.is(config.path, undefined);
});

test('Publish with deploy percentage', async t => {
    const config = await createConfig(null, { deployPercentage: 5 });

    t.is(config.deployPercentage, 5);
});

test('Publish without deploy percentage', async t => {
    const config = await createConfig(null, {});

    t.is(config.deployPercentage, undefined);
});

test('Auto upload and publish', async t => {
    const config = await createConfig('', {});
    t.false(config.isPublish);
    t.true(config.isUpload);
    t.true(config.autoPublish);
    t.truthy(config.path);
    t.is(config.maxAwaitInProgress, 300);
});

test('Throws error when deprecated secret flags are used', async t => {
    // Test with --client-id
    let error = await t.throwsAsync(
        async () => createConfig(null, { clientId: '123' }),
    );
    t.regex(error.message, /--client-id, --client-secret, and --refresh-token flags are no longer supported/);
    t.regex(error.message, /CLIENT_ID, CLIENT_SECRET, and REFRESH_TOKEN environment variables/);
    t.regex(error.message, /https:\/\/github\.com\/fregante\/chrome-webstore-upload-cli\/issues\/80/);

    // Test with --client-secret
    error = await t.throwsAsync(
        async () => createConfig(null, { clientSecret: '123' }),
    );
    t.regex(error.message, /--client-id, --client-secret, and --refresh-token flags are no longer supported/);

    // Test with --refresh-token
    error = await t.throwsAsync(
        async () => createConfig(null, { refreshToken: '123' }),
    );
    t.regex(error.message, /--client-id, --client-secret, and --refresh-token flags are no longer supported/);
});

test('Throws error when --source is used with publish command', async t => {
    const error = await t.throwsAsync(
        async () => createConfig('publish', { source: 'my-file.zip' }),
    );
    t.regex(error.message, /--source flag cannot be used with the "publish" command/);
    t.regex(error.message, /only used with the "upload" command/);
});

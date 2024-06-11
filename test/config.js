import process from 'node:process';
import test from 'ava';
import createConfig from '../config.js';
import { mockFileSystem } from './helpers/stubs.js';

mockFileSystem();

test('Favors params over env vars', async t => {
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
});

test('Publish', async t => {
    const config = await createConfig('publish', {});

    t.true(config.isPublish);
    t.false(config.isUpload);
});

test('Auto Publish', async t => {
    const config = await createConfig(null, { autoPublish: true });

    t.true(config.autoPublish);
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
});

import test from 'ava';
import createConfig from '../config.js';

test('Favors params over env vars', t => {
    process.env.EXTENSION_ID = 123;
    const expectedId = 456;
    const config = createConfig(null, { extensionId: expectedId });

    t.is(config.apiConfig.extensionId, expectedId);
    delete process.env.EXTENSION_ID;
});

test('All options supported as env vars', t => {
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

    const config = createConfig(null, {});
    t.is(config.apiConfig.extensionId, varsValue);
    t.is(config.apiConfig.clientId, varsValue);
    t.is(config.apiConfig.clientSecret, varsValue);
    t.is(config.apiConfig.refreshToken, varsValue);

    for (const name of vars) {
        delete process.env[name];
    }
});

test('Extracts zip path', t => {
    const source = 'foo.zip';
    const config = createConfig(null, { source });

    t.is(config.zipPath, source);
});

test('Upload', t => {
    const config = createConfig('upload', {});

    t.true(config.isUpload);
    t.false(config.isPublish);
});

test('Publish', t => {
    const config = createConfig('publish', {});

    t.true(config.isPublish);
    t.false(config.isUpload);
});

test('Auto Publish', t => {
    const config = createConfig(null, { autoPublish: true });

    t.true(config.autoPublish);
});

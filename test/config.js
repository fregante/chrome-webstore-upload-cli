const test = require('ava');
const createConfig = require('../config');

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
        'REFRESH_TOKEN'
    ];
    const varsVal = "123";

    vars.forEach(name => process.env[name] = varsVal);

    const config = createConfig(null, {});
    t.is(config.apiConfig.extensionId, varsVal);
    t.is(config.apiConfig.clientId, varsVal);
    t.is(config.apiConfig.clientSecret, varsVal);
    t.is(config.apiConfig.refreshToken, varsVal);

    vars.forEach(name => delete process.env[name]);
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

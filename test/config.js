import test from 'ava';
import createConfig from '../config';

test('Favors params over env vars', t => {
    process.env.EXTENSION_ID = 123;
    const expectedId = 456;
    const config = createConfig(null, { extensionId: expectedId });

    t.is(config.apiConfig.extensionId, expectedId);
    delete process.env.EXTENSION_ID;
});

test('Extracts zip path', t => {
    const file = 'foo.zip';
    const config = createConfig(null, { file });

    t.is(config.zipPath, file);
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

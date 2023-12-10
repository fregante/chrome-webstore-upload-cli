import test from 'ava';
import { execa } from 'execa';
import { mockFileSystem } from './helpers/stubs.js';

function env(vars = {}) {
    return {
        CLIENT_ID: 123,
        CLIENT_SECRET: 123,
        REFRESH_TOKEN: 123,
        EXTENSION_ID: 123,
        ...vars,
    };
}

mockFileSystem();

test('Exits w/ message when param required by "Web Store Upload" is not provided', async t => {
    try {
        await execa('./cli.js', ['upload', '--source', 'test/fixtures/without-junk']);
        t.fail('Should have errored');
    } catch (error) {
        t.regex(error.message, /Option ".+" is required/);
    }
});

test('It should attempt to read ./manifest.json when the --source param is not provided', async t => {
    try {
        await execa('./cli.js', ['upload'], {
            env: env(),
        });
        t.pass();
    } catch (error) {
        t.regex(error.message, /Using the cwd, the directory does not contain manifest.json/);
    }
});

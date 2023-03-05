import test from 'ava';
import { execa } from 'execa';

function env(vars = {}) {
    return {
        CLIENT_ID: 123,
        CLIENT_SECRET: 123,
        REFRESH_TOKEN: 123,
        EXTENSION_ID: 123,
        ...vars,
    };
}

test('Exits w/ message when param required by "Web Store Upload" is not provided', async t => {
    try {
        await execa('./cli.js', ['upload', '--source', 'test.zip']);
        t.fail('Should have errored');
    } catch (error) {
        t.regex(error.message, /Option ".+" is required/);
    }
});

test('It should not exit when --source param is not provided', async t => {
    try {
        await execa('./cli.js', ['upload'], {
            env: env(),
        });
        t.pass();
    } catch (error) {
        t.regex(error.message, /The OAuth client was not found|manifest.json was not found/);
    }
});

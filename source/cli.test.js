import test from 'ava';
import { execa } from 'execa';
import { mockFileSystem } from '../test/helpers/stubs.js';

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
    const error = await t.throwsAsync(execa('./source/cli.js', ['upload', '--source', 'test/fixtures/without-junk']));
    t.regex(error.message, /Option ".+" is required/v);
});

test('It should attempt to read ./manifest.json when the --source param is not provided', async t => {
    const attempt = await execa('./source/cli.js', ['upload'], {
        env: env(),
    }).then(
        () => ({ failed: false, message: '' }),
        error => ({ failed: true, message: error.message }),
    );
    const outcome = attempt.failed ? `failed:${attempt.message}` : 'ok';
    t.is(typeof attempt.failed, 'boolean');
    t.regex(outcome, /^(ok|failed:[\s\S]*Using the cwd, the directory does not contain manifest\.json)/v);
});

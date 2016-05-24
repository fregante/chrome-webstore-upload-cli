import test from 'ava';
import execa from 'execa';

function env(vars = {}) {
    return Object.assign({
        CLIENT_ID: 123,
        CLIENT_SECRET: 123,
        REFRESH_TOKEN: 123,
        EXTENSION_ID: 123
    }, vars);
}

test('Exits w/ message when param required by "Web Store Upload" is not provided', async t => {
    try {
        await execa('../index.js', ['upload', '--file', 'test.zip']);
        t.fail('Should have errored');
    } catch(err) {
        t.true(/Option ".+" is required/.test(err.message));
    }
});

test('Exits w/ message when --file param not provided', async t => {
    try {
        await execa('../index.js', ['upload'], {
            env: env()
        });
        t.fail('Should have errored');
    } catch(err) {
        t.true(err.message.includes('--file parameter required'));
    }
});

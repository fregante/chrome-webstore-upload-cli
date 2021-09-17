const test = require('ava');
const execa = require('execa');

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
        await execa('./index.js', ['upload', '--source', 'test.zip']);
        t.fail('Should have errored');
    } catch(err) {
        t.true(/Option ".+" is required/.test(err.message));
    }
});

test('It should not exit when --source param is not provided', async t => {
    try {
        await execa('./index.js', ['upload'], {
            env: env()
        });
        t.true();
    } catch(err) {
        t.true(/Response code 401 \(Unauthorized\)/.test(err.message));
    }
});

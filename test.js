import test from 'ava';
import execa from 'execa';

const clientId = 'client-id';
const clientSecret = 'client-secret';
const refreshToken = 'refresh-token';
const extensionId = 'extension-id';

test.skip('Exits with message when a required option is not provided', async t => {
    try {
        await execa('./index.js', ['upload']);
        t.fail('Should have errored');
    } catch(err) {
        t.true(/Option ".+" is required/.test(err.message));
    }
});

test.todo('Only fetches token once when uploading + publishing');
test.todo('Favors command line arguments over environment vars');
test.todo('throws when file not found');
test.todo('starts upload');
test.todo('starts publish');

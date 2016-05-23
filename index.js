#!/usr/bin/env node

const fs = require('fs');
const ora = require('ora');
const path = require('path');
const meow = require('meow');
const webstore = require('chrome-webstore-upload');

const cli = meow(`
    Usage
      $ webstore <command>

    where <command> is either both or one of
        upload, publish

    Options
      --extension-id    The ID of the Chrome Extension
      --client-id       OAuth2 Client ID
      --client-secret   OAuth2 Client Secret
      --refresh-token   OAuth2 Refresh Token

    Options (alternative)
        All options can be set through environment variables, using the constant-cased name of the option

    Examples
      Upload new extension archive to the Chrome Web Store
      $ webstore upload extension.zip --extension-id $EXTENSION_ID --client-id $CLIENT_ID --client-secret $CLIENT_SECRET --refresh-token $REFRESH_TOKEN

      Publish extension (with CLIENT_ID, CLIENT_SECRET, and REFRESH_TOKEN set as env variables)
      $ webstore publish --client-id elomekmlfonmdhmpmdfldcjgdoacjcba
`, {
    string: ['_']
});

const env = {
    extensionId: process.env.EXTENSION_ID,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN
};
const client = webstore(Object.assign(env, cli.flags));
const zipPath = cli.input.pop();
const commands = cli.input;
const isUpload = commands.includes('upload');
const isPublish = commands.includes('publish');

if (!isUpload || !isPublish) {
    throw new Error('Must specify command ("upload" or "publish")')
}

const spinner = ora();
const spinnerStart = (text) => {
    spinner.text = text;
    return spinner.start();
};

function upload(token) {
    spinnerStart(`Uploading ${path.basename(zipPath)}`);

    const fullPath = path.join(process.cwd(), zipPath);
    const zipStream = fs.createReadStream(fullPath);

    return client.uploadExisting(zipStream, token).then(res => {
        spinner.stop();
        return res;
    });
}

function publish(token) {
    spinnerStart('Publishing');

    return client.publish(undefined, token).then(res => {
        spinner.stop();
        return res;
    });
}

if (isUpload && isPublish) {
    spinnerStart('Fetching token');

    client.fetchToken().then(token => {
        return upload(token).then(res => {
            console.log(res);
            return publish(token);
        }).then(res => {
            console.log(res);
        });
    }).catch(errorHandler);

    return;
}

if (isUpload) {
    upload().then(res => {
        // TODO: Messaging to user on success/failure of upload
        console.log(res);
    }).catch(errorHandler);
}

if (isPublish) {
    publish().then(res => {
        // TODO: Messaging to user on success/failure of publish
        console.log(res);
    }).catch(errorHandler);
}

function errorHandler(err) {
    console.error(err);
    process.exit(1);
}

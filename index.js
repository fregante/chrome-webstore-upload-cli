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

let client;
try {
    client = webstore(Object.assign(env, cli.flags));
} catch(err) {
    console.error(err.message);
    process.exit(1);
}

const zipPath = cli.input.pop();
const commands = cli.input;
const isUpload = commands.includes('upload');
const isPublish = commands.includes('publish');

if (!(isUpload || isPublish)) {
    console.error('Must specify command ("upload" or "publish")');
    process.exit(1);
}

const spinner = ora();
const spinnerStart = (text) => {
    spinner.text = text;
    return spinner.start();
};

if (isUpload && isPublish) {
    spinnerStart('Fetching token');

    client.fetchToken().then(token => {
        return upload(token).then(res => {
            if (!isUploadSuccess(res)) {
                return exitWithUploadFailure(res);
            }

            return publish(token).then(exitWithPublishStatus);
        });
    }).catch(errorHandler);

    return;
}

if (isUpload) {
    upload().then(res => {
        if (!isUploadSuccess(res)) {
            return exitWithUploadFailure(res);
        }
        console.log('Upload Completed');
    }).catch(errorHandler);
}

if (isPublish) {
    publish().then(exitWithPublishStatus).catch(errorHandler);
}

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

function isUploadSuccess(res) {
    return res.uploadState === 'SUCCESS';
}

function exitWithUploadFailure(item) {
    const firstError = item.itemError[0];
    console.log(`Error Code: ${firstError.error_code}`);
    console.log(`Details: ${firstError.error_detail}`);
    process.exit(1);
}

function exitWithPublishStatus(item) {
    const firstStatus = item.status[0];
    const firstStatusDetail = item.status[0];
    console.log(`Publish Status: ${firstStatus}`);
    console.log(`Details: ${firstStatusDetail}`);
    process.exit(0);
}

function errorHandler(err) {
    console.error(err);
    process.exit(1);
}

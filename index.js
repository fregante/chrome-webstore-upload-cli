#!/usr/bin/env node

const ora = require('ora');
const path = require('path');
const meow = require('meow');
const createConfig = require('./config');
const { upload, publish, fetchToken } = require('./wrapper');
const {
    isUploadSuccess,
    exitWithUploadFailure,
    exitWithPublishStatus,
    validateInput
} = require('./util');

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

const isValidInput = validateInput(cli.input);
if (isValidInput.error) {
    console.error(isValidInput.error);
    process.exit(1);
}

const {
    apiConfig,
    zipPath,
    isUpload,
    isPublish
} = createConfig(cli.input, cli.flags);

const spinner = ora();
const spinnerStart = (text) => {
    spinner.text = text;
    return spinner.start();
};

if (isUpload && isPublish) {
    spinnerStart('Fetching token');

    fetchToken(apiConfig).then(token => {
        spinnerStart(`Uploading ${path.basename(zipPath)}`);

        return upload({
            apiConfig,
            token,
            zipPath
        }).then(uploadRes => {
            if (!isUploadSuccess(uploadRes)) {
                spinner.stop();
                return exitWithUploadFailure(uploadRes);
            }

            spinnerStart('Publishing');
            return publish({ apiConfig, token }).then(publishRes => {
                spinner.stop();
                exitWithPublishStatus(publishRes);
            });
        })
    }).catch(errorHandler);

    return;
}

if (isUpload) {
    spinnerStart(`Uploading ${path.basename(zipPath)}`);
    upload({
        apiConfig,
        zipPath
    }).then(res => {
        spinner.stop();
        if (!isUploadSuccess(res)) return exitWithUploadFailure(res);

        console.log('Upload Completed');
    }).catch(errorHandler);
}

if (isPublish) {
    spinnerStart('Publishing');
    publish({ apiConfig }).then(res => {
        spinner.stop();
        exitWithPublishStatus(res);
    }).catch(errorHandler);
}

function errorHandler(err) {
    console.error(err);
    process.exit(1);
}

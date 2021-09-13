#!/usr/bin/env node

const ora = require('ora');
const path = require('path');
const meow = require('meow');
const { green, red, yellow } = require('chalk');
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

    where <command> is one of
        upload, publish

    Options
      --source             Path to either a zip file, or a directory to be zipped
      --extension-id       The ID of the Chrome Extension (environment variable EXTENSION_ID)
      --client-id          OAuth2 Client ID (environment variable CLIENT_ID)
      --client-secret      OAuth2 Client Secret (environment variable CLIENT_SECRET)
      --refresh-token      OAuth2 Refresh Token (environment variable REFRESH_TOKEN)
      --auto-publish       Can be used with the "upload" command
      --trusted-testers    Can be used with the "publish" command


    Examples
      Upload new extension archive to the Chrome Web Store
      $ webstore upload --source extension.zip --extension-id $EXTENSION_ID --client-id $CLIENT_ID --client-secret $CLIENT_SECRET --refresh-token $REFRESH_TOKEN

      Publish extension (with CLIENT_ID, CLIENT_SECRET, and REFRESH_TOKEN set as env variables)
      $ webstore publish --extension-id elomekmlfonmdhmpmdfldcjgdoacjcba
`, {
    flags: {
        _: {
            type: 'string'
        },
        source: {
            type: 'string',
            default: process.cwd()
        }
    }
});

const preliminaryValidation = validateInput(cli.input, cli.flags);
if (preliminaryValidation.error) {
    console.error(red(preliminaryValidation.error));
    cli.showHelp(1);
}

const {
    apiConfig,
    zipPath,
    isUpload,
    isPublish,
    autoPublish,
    trustedTesters
} = createConfig(cli.input[0], cli.flags);

const spinner = ora();
const spinnerStart = (text) => {
    spinner.text = text;
    return spinner.start();
};

if (isUpload && autoPublish) {
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
            return publish({ apiConfig, token }, trustedTesters && 'trustedTesters').then(publishRes => {
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

        console.log(green('Upload Completed'));
    }).catch(errorHandler);
}

if (isPublish) {
    spinnerStart('Publishing');

    publish({ apiConfig }, trustedTesters && 'trustedTesters').then(res => {
        spinner.stop();
        exitWithPublishStatus(res);
    }).catch(errorHandler);
}

function errorHandler(err) {
    spinner.stop();
    console.error(red(err.message));

    if (err.response && err.response.body) {
        try {
            console.error(yellow(JSON.stringify(err.response.body, null, 4)));
        } catch (err) {}
    }
    process.exit(1);
}

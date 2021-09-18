#!/usr/bin/env node

import path from 'node:path';
import ora from 'ora';
import meow from 'meow';
import chalk from 'chalk';
import createConfig from './config.js';
import { upload, publish, fetchToken } from './wrapper.js';
import {
    isUploadSuccess,
    exitWithUploadFailure,
    exitWithPublishStatus,
    validateInput,
} from './util.js';

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
    importMeta: import.meta,
    flags: {
        source: {
            type: 'string',
            default: process.cwd(),
        },
    },
});

const preliminaryValidation = validateInput(cli.input, cli.flags);
if (preliminaryValidation.error) {
    console.error(chalk.red(preliminaryValidation.error));
    cli.showHelp(1);
}

const {
    apiConfig,
    zipPath,
    isUpload,
    isPublish,
    autoPublish,
    trustedTesters,
} = createConfig(cli.input[0], cli.flags);

const spinner = ora();
const spinnerStart = text => {
    spinner.text = text;
    return spinner.start();
};

function doAutoPublish() {
    spinnerStart('Fetching token');

    fetchToken(apiConfig).then(token => {
        spinnerStart(`Uploading ${path.basename(zipPath)}`);

        return upload({
            apiConfig,
            token,
            zipPath,
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
        });
    }).catch(errorHandler);
}

function doUpload() {
    spinnerStart(`Uploading ${path.basename(zipPath)}`);
    upload({
        apiConfig,
        zipPath,
    }).then(res => {
        spinner.stop();
        if (!isUploadSuccess(res)) {
            return exitWithUploadFailure(res);
        }

        console.log(chalk.green('Upload Completed'));
    }).catch(errorHandler);
}

function doPublish() {
    spinnerStart('Publishing');

    publish({ apiConfig }, trustedTesters && 'trustedTesters').then(res => {
        spinner.stop();
        exitWithPublishStatus(res);
    }).catch(errorHandler);
}

function errorHandler(err) {
    spinner.stop();
    console.error(chalk.red(err.message));

    if (err.response && err.response.body) {
        console.error(chalk.yellow(JSON.stringify(err.response.body, null, 4)));
    }

    process.exit(1);
}

if (isUpload && autoPublish) {
    doAutoPublish();
} else if (isUpload) {
    doUpload();
} else if (isPublish) {
    doPublish();
}

#!/usr/bin/env node

import path from 'node:path';
import process from 'node:process';
import ora from 'ora';
import meow from 'meow';
import createConfig from './config.js';
import { upload, publish, fetchToken } from './wrapper.js';
import {
    isUploadSuccess,
    handlePublishStatus,
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
    console.error(preliminaryValidation.error);
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

async function doAutoPublish() {
    spinnerStart('Fetching token');

    const token = await fetchToken(apiConfig);
    spinnerStart(`Uploading ${path.basename(zipPath)}`);

    const uploadResponse = await upload({
        apiConfig,
        token,
        zipPath,
    });

    if (!isUploadSuccess(uploadResponse)) {
        throw uploadResponse;
    }

    spinnerStart('Publishing');
    const publishResponse = await publish(
        { apiConfig, token },
        trustedTesters && 'trustedTesters',
    );
    spinner.stop();
    handlePublishStatus(publishResponse);
}

async function doUpload() {
    spinnerStart(`Uploading ${path.basename(zipPath)}`);
    const response = await upload({
        apiConfig,
        zipPath,
    });

    spinner.stop();
    if (!isUploadSuccess(response)) {
        throw response;
    }

    console.log('Upload completed');
}

async function doPublish() {
    spinnerStart('Publishing');

    const response = await publish(
        { apiConfig },
        trustedTesters && 'trustedTesters',
    );
    spinner.stop();
    handlePublishStatus(response);
}

function errorHandler(error) {
    spinner.stop();

    console.log(error?.response?.body ?? error);
    process.exitCode = 1;

    if (error?.name === 'HTTPError') {
        const response = JSON.parse(error?.response?.body ?? '{}');
        const { clientId, refreshToken } = apiConfig;
        if (response.error_description === 'The OAuth client was not found.') {
            console.error(
                'Probably the provided client ID is not valid. Try following the guide again',
            );
            console.error(
                'https://github.com/fregante/chrome-webstore-upload/blob/main/How%20to%20generate%20Google%20API%20keys.md',
            );
            console.error({ clientId });
            return;
        }

        if (response.error_description === 'Bad Request') {
            const { clientId } = apiConfig;
            console.error(
                'Probably the provided refresh token is not valid. Try following the guide again',
            );
            console.error(
                'https://github.com/fregante/chrome-webstore-upload/blob/main/How%20to%20generate%20Google%20API%20keys.md',
            );
            console.error({ clientId, refreshToken });
            return;
        }

        if (error?.message === 'Response code 400 (Bad Request)') {
            // Nothing else to add
            return;
        }
    }

    if (error?.itemError?.length > 0) {
        for (const itemError of error.itemError) {
            console.error('Error: ' + itemError.error_code);
            console.error(itemError.error_detail);
        }
    }
}

async function init() {
    if (isUpload && autoPublish) {
        await doAutoPublish();
    } else if (isUpload) {
        await doUpload();
    } else if (isPublish) {
        await doPublish();
    }
}

init().catch(errorHandler);

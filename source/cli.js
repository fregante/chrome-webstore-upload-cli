#!/usr/bin/env node

import nodePath from 'node:path';
import meow from 'meow';
import createConfig from './config.js';
import { upload, publish, fetchToken } from './wrapper.js';
import { isUploadSuccess, handlePublishStatus } from './util.js';
import { handleError } from './error-handler.js';

const cli = meow(`
    Usage
      $ chrome-webstore-upload [command]

    where [command] can be one of
        upload, publish

    if the command is missing, it will both upload and publish the extension.

    Options
      --source                  Path to either a zip file, a crx file, or a directory to be zipped. Defaults to the value of webExt.sourceDir in package.json or the current directory if not specified
      --extension-id            The ID of the Chrome Extension (environment variable EXTENSION_ID)
      --publisher-id            The publisher ID of your Chrome Web Store developer account (environment variable PUBLISHER_ID)
      --trusted-testers         Can be used with the "publish" command
      --deploy-percentage       Can be used with the "publish" command. Defaults to 100
      --max-await-in-progress   Max time to wait for the upload to complete, if it's returning IN_PROGRESS (in seconds, defaults to 300)

    Environment Variables (required)
      CLIENT_ID                 OAuth2 Client ID
      CLIENT_SECRET             OAuth2 Client Secret
      REFRESH_TOKEN             OAuth2 Refresh Token
      PUBLISHER_ID              Your Chrome Web Store publisher ID

    Examples
      Upload and publish a new version, using existing environment variables and the default value for --source
      $ chrome-webstore-upload

      Upload new extension archive to the Chrome Web Store
      $ chrome-webstore-upload upload --source my-custom-zip.zip

      Publish the last uploaded version (whether it was uploaded via web UI or via CLI)
      $ chrome-webstore-upload publish --extension-id elomekmlfonmdhmpmdfldcjgdoacjcba
`, {
    importMeta: import.meta,
    flags: {
        source: {
            type: 'string',
        },
        maxAwaitInProgress: {
            type: 'number',
        },
    },
});

if (cli.input.length > 1) {
    console.error('Too many parameters');
    cli.showHelp(1);
}

const {
    apiConfig,
    path,
    isUpload,
    isPublish,
    autoPublish,
    trustedTesters,
    deployPercentage,
    maxAwaitInProgress,
} = await createConfig(cli.input[0], cli.flags);

async function doAutoPublish() {
    console.log('Fetching token...');

    const token = await fetchToken(apiConfig);
    console.log(`Uploading ${nodePath.basename(path)}...`);

    const uploadResponse = await upload({
        apiConfig,
        token,
        path,
        maxAwaitInProgress,
    });

    if (!isUploadSuccess(uploadResponse)) {
        throw uploadResponse;
    }

    console.log('Publishing...');
    const publishResponse = await publish(
        { apiConfig, token },
        trustedTesters ? 'TRUSTED_TESTERS' : undefined,
        deployPercentage,
    );

    handlePublishStatus(publishResponse);
}

async function doUpload() {
    console.log(`Uploading ${nodePath.basename(path)}`);
    const response = await upload({
        apiConfig,
        path,
        maxAwaitInProgress,
    });

    if (!isUploadSuccess(response)) {
        throw response;
    }

    console.log('Upload completed');
}

async function doPublish() {
    console.log('Publishing');

    const response = await publish(
        { apiConfig },
        trustedTesters ? 'TRUSTED_TESTERS' : undefined,
        deployPercentage,
    );

    handlePublishStatus(response);
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

try {
    await init();
} catch (error) {
    handleError(error);
}

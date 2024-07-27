#!/usr/bin/env node

import path from 'node:path';
import process from 'node:process';
import meow from 'meow';
import createConfig from './config.js';
import { upload, publish, fetchToken } from './wrapper.js';
import {
    isUploadSuccess,
    handlePublishStatus,
} from './util.js';

const cli = meow(`
    Usage
      $ chrome-webstore-upload [command]

    where [command] can be one of
        upload, publish

    if the command is missing, it will both upload and publish the extension.

    Options
      --source            Path to either a zip file or a directory to be zipped. Defaults to the value of webExt.sourceDir in package.json or the current directory if not specified
      --extension-id      The ID of the Chrome Extension (environment variable EXTENSION_ID)
      --client-id         OAuth2 Client ID (environment variable CLIENT_ID)
      --client-secret     OAuth2 Client Secret (environment variable CLIENT_SECRET)
      --refresh-token     OAuth2 Refresh Token (environment variable REFRESH_TOKEN)
      --auto-publish      Can be used with the "upload" command (deprecated, use \`chrome-webstore-upload\` without a command instead)
      --trusted-testers   Can be used with the "publish" command
      --deploy-percentage Can be used with the "publish" command. Defaults to 100

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
    },
});

if (cli.input.length > 1) {
    console.error('Too many parameters');
    cli.showHelp(1);
}

const {
    apiConfig,
    zipPath,
    isUpload,
    isPublish,
    autoPublish,
    trustedTesters,
    deployPercentage,
} = await createConfig(cli.input[0], cli.flags);

async function doAutoPublish() {
    console.log('Fetching token...');

    const token = await fetchToken(apiConfig);
    console.log(`Uploading ${path.basename(zipPath)}...`);

    const uploadResponse = await upload({
        apiConfig,
        token,
        zipPath,
    });

    if (!isUploadSuccess(uploadResponse)) {
        throw uploadResponse;
    }

    console.log('Publishing...');
    const publishResponse = await publish(
        { apiConfig, token },
        trustedTesters && 'trustedTesters',
        deployPercentage,
    );

    handlePublishStatus(publishResponse);
}

async function doUpload() {
    console.log(`Uploading ${path.basename(zipPath)}`);
    const response = await upload({
        apiConfig,
        zipPath,
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
        trustedTesters && 'trustedTesters',
        deployPercentage,
    );

    handlePublishStatus(response);
}

function errorHandler(error) {
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
                'https://github.com/fregante/chrome-webstore-upload-keys',
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
                'https://github.com/fregante/chrome-webstore-upload-keys',
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

try {
    await init();
} catch (error) {
    errorHandler(error);
}

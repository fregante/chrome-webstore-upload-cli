import fs from 'node:fs';
import getClient from 'chrome-webstore-upload';
import zipdir from './zipdir.js';
import { isArchive } from './util.js';

export async function upload({ apiConfig, zipPath, token, maxAwaitInProgress }) {
    const client = getClient(apiConfig);
    const zipStream = isArchive(zipPath)
        ? fs.createReadStream(zipPath)
        : await zipdir(zipPath);
    return client.uploadExisting(zipStream, token, maxAwaitInProgress);
}

export async function publish({ apiConfig, token }, publishTarget, deployPercentage) {
    const client = getClient(apiConfig);
    return client.publish(publishTarget, token, deployPercentage);
}

export async function fetchToken(apiConfig) {
    const client = getClient(apiConfig);
    return client.fetchToken();
}

import fs from 'node:fs';
import path from 'node:path';
import getClient from 'chrome-webstore-upload';
import zipdir from './zipdir.js';

const isZip = filepath => path.extname(filepath) === '.zip';

export async function upload({ apiConfig, zipPath, token }) {
    const client = getClient(apiConfig);
    const zipStream = isZip(zipPath)
        ? fs.createReadStream(zipPath)
        : await zipdir(zipPath);
    return client.uploadExisting(zipStream, token);
}

export async function publish({ apiConfig, token }, publishTarget, deployPercentage) {
    const client = getClient(apiConfig);
    return client.publish(publishTarget, token, deployPercentage);
}

export async function fetchToken(apiConfig) {
    const client = getClient(apiConfig);
    return client.fetchToken();
}

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import getClient from 'chrome-webstore-upload';
import zipdir from './zipdir.js';

const isZip = filepath => path.extname(filepath) === '.zip';

export async function upload({ apiConfig, zipPath, token }) {
    let client;
    try {
        client = getClient(apiConfig);
    } catch (error) {
        return Promise.reject(error);
    }

    const fullPath = path.join(process.cwd(), zipPath);

    if (isZip(fullPath)) {
        const zipStream = fs.createReadStream(fullPath);
        return client.uploadExisting(zipStream, token);
    }

    const zipStream = await zipdir(zipPath);
    return client.uploadExisting(zipStream, token);
}

export async function publish({ apiConfig, token }, publishTarget) {
    const client = getClient(apiConfig);
    return client.publish(publishTarget, token);
}

export async function fetchToken(apiConfig) {
    const client = getClient(apiConfig);
    return client.fetchToken();
}

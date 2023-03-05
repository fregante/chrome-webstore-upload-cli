import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import getClient from 'chrome-webstore-upload';
import zipdir from './zipdir.js';

const isZip = filepath => path.extname(filepath) === '.zip';

export async function upload({ apiConfig, zipPath, token }) {
    const client = getClient(apiConfig);
    const fullPath = path.join(process.cwd(), zipPath);
    const zipStream = isZip(fullPath)
        ? fs.createReadStream(fullPath)
        : await zipdir(zipPath);
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

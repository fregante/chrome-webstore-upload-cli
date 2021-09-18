import fs from 'node:fs';
import path from 'node:path';
import getClient from 'chrome-webstore-upload';
import zipdir from './zipdir.js';

const isZip = filepath => path.extname(filepath) === '.zip';

export function upload({ apiConfig, zipPath, token }) {
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

    return zipdir(zipPath).then(zipStream => client.uploadExisting(zipStream, token));
}

export function publish({ apiConfig, token }, publishTarget) {
    let client;
    try {
        client = getClient(apiConfig);
    } catch (error) {
        return Promise.reject(error);
    }

    return client.publish(publishTarget, token);
}

export function fetchToken(apiConfig) {
    let client;
    try {
        client = getClient(apiConfig);
    } catch (error) {
        return Promise.reject(error);
    }

    return client.fetchToken();
}


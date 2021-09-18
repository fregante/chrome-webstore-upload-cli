const fs = require('fs');
const path = require('path');
const webstore = require('chrome-webstore-upload');
const zipdir = require('./zipdir');

function getClient(apiConfig) {
    return webstore(apiConfig);
}

const isZip = filepath => path.extname(filepath) === '.zip';

module.exports = {
    upload({ apiConfig, zipPath, token }) {
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
    },

    publish({ apiConfig, token }, publishTarget) {
        let client;
        try {
            client = getClient(apiConfig);
        } catch (error) {
            return Promise.reject(error);
        }

        return client.publish(publishTarget, token);
    },

    fetchToken(apiConfig) {
        let client;
        try {
            client = getClient(apiConfig);
        } catch (error) {
            return Promise.reject(error);
        }

        return client.fetchToken();
    },
};

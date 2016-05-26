const fs = require('fs');
const path = require('path');
const zipdir = require('./zipdir');
const webstore = require('chrome-webstore-upload');

function getClient(apiConfig) {
    return webstore(apiConfig);
}

const isZip = filepath => path.extname(filepath) === '.zip';

module.exports = {
    upload({ apiConfig, zipPath, token }) {
        let client;
        try {
            client = getClient(apiConfig);
        } catch(err) {
            return Promise.reject(err);
        }

        const fullPath = path.join(process.cwd(), zipPath);

        if (isZip(fullPath)) {
            const zipStream = fs.createReadStream(fullPath);
            return client.uploadExisting(zipStream, token);
        }

        return zipdir(zipPath).then(zipStream => {
            return client.uploadExisting(zipStream, token);
        });
    },

    publish({ apiConfig, token }) {
        let client;
        try {
            client = getClient(apiConfig);
        } catch(err) {
            return Promise.reject(err);
        }

        return client.publish(undefined, token);
    },

    fetchToken(apiConfig) {
        let client;
        try {
            client = getClient(apiConfig);
        } catch(err) {
            return Promise.reject(err);
        }
        
        return client.fetchToken();
    }
};

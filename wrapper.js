const fs = require('fs');
const path = require('path');
const webstore = require('chrome-webstore-upload');

function getClient(apiConfig) {
    return webstore(apiConfig);
}

module.exports = {
    upload({ apiConfig, zipPath, token }) {
        let client;
        try {
            client = getClient(apiConfig);
        } catch(err) {
            return Promise.reject(err);
        }

        const fullPath = path.join(process.cwd(), zipPath);
        const zipStream = fs.createReadStream(fullPath);

        return client.uploadExisting(zipStream, token);
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

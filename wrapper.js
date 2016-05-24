const fs = require('fs');
const path = require('path');
const webstore = require('chrome-webstore-upload');

module.exports = {
    upload({ apiConfig, zipPath, token }) {
        const client = webstore(apiConfig);
        const fullPath = path.join(process.cwd(), zipPath);
        const zipStream = fs.createReadStream(fullPath);

        return client.uploadExisting(zipStream, token);
    },

    publish({ apiConfig, token }) {
        const client = webstore(apiConfig);
        return client.publish(undefined, token);
    },

    fetchToken(apiConfig) {
        const client = webstore(apiConfig);
        return client.fetchToken();
    }
};

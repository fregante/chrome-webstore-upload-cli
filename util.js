module.exports = {
    isUploadSuccess(res) {
        return res.uploadState === 'SUCCESS';
    },

    exitWithUploadFailure(item) {
        const firstError = item.itemError[0];
        console.log(`Error Code: ${firstError.error_code}`);
        console.log(`Details: ${firstError.error_detail}`);
        process.exit(1);
    },

    exitWithPublishStatus(item) {
        const firstStatus = item.status[0];
        const firstStatusDetail = item.status[0];
        console.log(`Publish Status: ${firstStatus}`);
        console.log(`Details: ${firstStatusDetail}`);
        process.exit(0);
    },

    validateInput(input) {
        if (input.length > 2) {
            return { error: 'Too many parameters passed' };
        }

        if (input.length < 2) {
            return { error: 'Required parameters missing' }
        }

        return { valid: true };
    }
};

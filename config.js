module.exports = function(command, flags) {
    const apiConfig = {
        extensionId: flags.extensionId || process.env.EXTENSION_ID,
        clientId: flags.clientId || process.env.CLIENT_ID,
        clientSecret: flags.clientSecret || process.env.CLIENT_SECRET,
        refreshToken: flags.refreshToken || process.env.REFRESH_TOKEN
    };

    return {
        apiConfig,
        target: flags.target || process.env.EXTENSION_TARGET
        zipPath: flags.source,
        isUpload: command === 'upload',
        isPublish: command === 'publish',
        autoPublish: flags.autoPublish
    };
};

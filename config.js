module.exports = function(command, flags) {
    const apiConfig = {
        extensionId: flags.extensionId || process.env.EXTENSION_ID,
        clientId: flags.clientId || process.env.CLIENT_ID,
        clientSecret: flags.clientSecret || process.env.CLIENT_SECRET,
        refreshToken: flags.refreshToken || process.env.REFRESH_TOKEN
    };

    const zipPath = flags.file;

    return {
        apiConfig,
        zipPath: flags.file,
        isUpload: command === 'upload',
        isPublish: command === 'publish',
        autoPublish: flags.autoPublish
    };
};

import process from 'node:process';

export default function getConfig(command, flags) {
    const apiConfig = {
        extensionId: flags.extensionId || process.env.EXTENSION_ID,
        clientId: flags.clientId || process.env.CLIENT_ID,
        clientSecret: flags.clientSecret || process.env.CLIENT_SECRET,
        refreshToken: flags.refreshToken || process.env.REFRESH_TOKEN,
    };

    return {
        apiConfig,
        zipPath: flags.source,
        isUpload: command === 'upload',
        isPublish: command === 'publish',
        autoPublish: flags.autoPublish,
        trustedTesters: flags.trustedTesters,
    };
}

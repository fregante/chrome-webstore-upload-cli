import process from 'node:process';
import findSource from './find-source.js';

export default async function getConfig(command, flags) {
    // Check for deprecated secret flags
    if (flags.clientId || flags.clientSecret || flags.refreshToken) {
        throw new Error('The --client-id, --client-secret, and --refresh-token flags are no longer supported. Please use the CLIENT_ID, CLIENT_SECRET, and REFRESH_TOKEN environment variables instead. See https://github.com/fregante/chrome-webstore-upload-cli/issues/80');
    }

    const apiConfig = {
        extensionId: flags.extensionId || process.env.EXTENSION_ID,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    };
    const isUpload = command === 'upload' || !command;
    return {
        apiConfig,
        path: isUpload ? await findSource(flags.source) : undefined,
        isUpload,
        isPublish: command === 'publish',
        autoPublish: !command,
        trustedTesters: flags.trustedTesters,
        deployPercentage: flags.deployPercentage,
        maxAwaitInProgress: flags.maxAwaitInProgress,
    };
}

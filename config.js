import process from 'node:process';
import findSource from './find-source.js';

export default async function getConfig(command, flags) {
    // Check for deprecated secret flags
    if (flags.clientId) {
        throw new Error('The --client-id flag is no longer supported. Please use the CLIENT_ID environment variable instead.');
    }

    if (flags.clientSecret) {
        throw new Error('The --client-secret flag is no longer supported. Please use the CLIENT_SECRET environment variable instead.');
    }

    if (flags.refreshToken) {
        throw new Error('The --refresh-token flag is no longer supported. Please use the REFRESH_TOKEN environment variable instead.');
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
        zipPath: isUpload ? await findSource(flags.source) : undefined,
        isUpload,
        isPublish: command === 'publish',
        autoPublish: flags.autoPublish || !command,
        trustedTesters: flags.trustedTesters,
        deployPercentage: flags.deployPercentage,
        maxAwaitInProgress: flags.maxAwaitInProgress,
    };
}

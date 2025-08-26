import process from 'node:process';
import findSource from './find-source.js';

export default async function getConfig(command, flags) {
    const apiConfig = {
        extensionId: flags.extensionId || process.env.EXTENSION_ID,
        clientId: flags.clientId || process.env.CLIENT_ID,
        clientSecret: flags.clientSecret || process.env.CLIENT_SECRET,
        refreshToken: flags.refreshToken || process.env.REFRESH_TOKEN,
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

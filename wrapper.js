import getClient from 'chrome-webstore-upload';

const retryIntervalSeconds = 2;

export async function upload({ apiConfig, path, token, maxAwaitInProgress }) {
    const client = getClient(apiConfig);
    return client.uploadExisting(path, token, maxAwaitInProgress);
}

async function waitForUploadSuccess(client, token, maxAwaitInProgressSeconds) {
    if (maxAwaitInProgressSeconds < retryIntervalSeconds) {
        return;
    }

    const response = await client.get('DRAFT', token);

    if (response.uploadState !== 'IN_PROGRESS') {
        return;
    }

    // Wait before checking again
    await new Promise(resolve => {
        setTimeout(resolve, retryIntervalSeconds * 1000);
    });

    // Retry
    return waitForUploadSuccess(client, token, maxAwaitInProgressSeconds - retryIntervalSeconds);
}

export async function publish({ apiConfig, token }, publishTarget, deployPercentage, maxAwaitInProgress = 60) {
    const client = getClient(apiConfig);

    // Wait for any in-progress upload to complete before publishing
    await waitForUploadSuccess(client, token, maxAwaitInProgress);

    return client.publish(publishTarget, token, deployPercentage);
}

export async function fetchToken(apiConfig) {
    const client = getClient(apiConfig);
    return client.fetchToken();
}

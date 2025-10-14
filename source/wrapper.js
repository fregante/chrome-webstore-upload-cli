import getClient from 'chrome-webstore-upload';

export async function upload({ apiConfig, path, token, maxAwaitInProgress }) {
    const client = getClient(apiConfig);
    return client.uploadExisting(path, token, maxAwaitInProgress);
}

export async function publish({ apiConfig, token }, publishTarget, deployPercentage) {
    const client = getClient(apiConfig);
    return client.publish(publishTarget, token, deployPercentage);
}

export async function fetchToken(apiConfig) {
    const client = getClient(apiConfig);
    return client.fetchToken();
}

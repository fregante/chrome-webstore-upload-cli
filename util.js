import { relative } from 'node:path';

export function isUploadSuccess(response) {
    return response.uploadState === 'SUCCESS';
}

export function handlePublishStatus(item) {
    const [firstStatus] = item.status;
    if (firstStatus === 'OK') {
        console.log('Publish successful');
        return;
    }

    throw item;
}

export function validateInput(input) {
    if (input.length === 0) {
        return { error: 'Must specify "upload" or "publish"' };
    }

    if (input.length > 1) {
        return { error: 'Too many parameters' };
    }

    return { valid: true };
}

export function zipPath(root, file) {
    return relative(root, file);
}


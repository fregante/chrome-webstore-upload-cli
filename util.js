import { extname } from 'node:path';

export function isArchive(filepath) {
    const ext = extname(filepath);
    return ext === '.zip' || ext === '.crx';
}

export function isUploadSuccess(response) {
    return response.uploadState === 'SUCCESS';
}

export function handlePublishStatus(item) {
    const [firstStatus] = item.status;
    if (firstStatus === 'OK') {
        console.log('Publish successful');
        return;
    }

    if (firstStatus === 'ITEM_PENDING_REVIEW') {
        console.log('Publish pending review');
        return;
    }

    throw item;
}

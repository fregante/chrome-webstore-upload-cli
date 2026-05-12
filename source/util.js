import path from 'node:path';

export function isArchive(filepath) {
    const ext = path.extname(filepath);
    return ext === '.zip' || ext === '.crx';
}

export function isUploadSuccess(response) {
    return response.uploadState === 'SUCCESS';
}

export function handlePublishStatus(item) {
    if (item.state === 'PUBLISHED') {
        console.log('Publish successful');
        return;
    }

    throw new Error(`Unexpected publish state: ${item.state}`);
}

import path from 'node:path';

export function isArchive(filepath) {
    const ext = path.extname(filepath);
    return ext === '.zip' || ext === '.crx';
}

export function isUploadSuccess(response) {
    return response.uploadState === 'SUCCESS';
}

export function handlePublishStatus(item) {
    switch (item.state) {
        case 'PUBLISHED': {
            console.log('Published successfully');
            return;
        }

        case 'PUBLISHED_TO_TESTERS': {
            console.log('Published to trusted testers');
            return;
        }

        case 'PENDING_REVIEW': {
            console.log('Pending review');
            return;
        }

        case 'STAGED': {
            console.log('Staged and ready to publish');
            return;
        }

        case 'CANCELLED': {
            console.log('Submission was cancelled');
            return;
        }

        case 'REJECTED': {
            throw new Error('Publish rejected');
        }

        default: {
            console.log(`Publish state: ${item.state}`);
        }
    }
}

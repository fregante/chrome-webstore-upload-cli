import { relative } from 'node:path';

export function isUploadSuccess(res) {
    return res.uploadState === 'SUCCESS';
}

export function exitWithUploadFailure(item) {
    const firstError = item.itemError[0];
    console.log(`Error Code: ${firstError.error_code}`);
    console.log(`Details: ${firstError.error_detail}`);
    process.exit(1);
}

export function exitWithPublishStatus(item) {
    const firstStatus = item.status[0];
    // TODO: Look at item stucture and determine where "detail" actually is,
    // since it's clearly not the same as the line right above this
    // const firstStatusDetail = item.status[0];
    console.log(`Publish Status: ${firstStatus}`);
    process.exit(0);
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


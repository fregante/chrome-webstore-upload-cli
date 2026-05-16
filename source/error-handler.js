import process from 'node:process';

export function extractDetailLines(details) {
    const detailItems = Array.isArray(details)
        ? details
        : (details ? [details] : []);
    const lines = [];

    for (const detail of detailItems) {
        if (!detail || typeof detail !== 'object') {
            continue;
        }

        if (Array.isArray(detail.fieldViolations)) {
            for (const violation of detail.fieldViolations) {
                if (!violation || typeof violation !== 'object') {
                    continue;
                }

                const field = typeof violation.field === 'string' ? violation.field.trim() : '';
                const description = typeof violation.description === 'string' ? violation.description.trim() : '';
                const reason = typeof violation.reason === 'string' ? violation.reason.trim() : '';
                const message = [description, reason].filter(Boolean).join(' ');

                if (!message) {
                    continue;
                }

                lines.push(field ? `${field}: ${message}` : message);
            }

            continue;
        }

        if (typeof detail.message === 'string') {
            lines.push(detail.message);
            continue;
        }

        if (typeof detail.reason === 'string') {
            lines.push(detail.reason);
        }
    }

    return [...new Set(lines)];
}

export function handleError(error) {
    process.exitCode = 1;

    if (error?.name === 'CWSError') {
        console.error(`❌ ${error.message}`);

        const detailLines = extractDetailLines(error.details);
        if (detailLines.length > 0) {
            console.error('Details:');
            for (const line of detailLines) {
                console.error(`- ${line}`);
            }
        }

        console.error('Does the dev console require changes?');
        console.error('https://chrome.google.com/webstore/devconsole');
        console.error('');
        console.error('Did you follow the guide to generate the keys?');
        console.error('https://github.com/fregante/chrome-webstore-upload-keys');
        return;
    }

    console.log(error);
}

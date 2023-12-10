import process from 'node:process';
import mockFs from 'mock-fs';

export function stubProcessExit(stub) {
    const old = process.exit;
    process.exit = stub;
    return () => {
        process.exit = old;
    };
}

export function stubConsoleLog(stub) {
    const old = console.log;
    console.log = stub;
    return () => {
        console.log = old;
    };
}

const validManifest = '{"manifest_version": 2}';
const invalidManifest = '{"version": 2}';

export function mockFileSystem() {
    mockFs({
        'extension.zip': 'LZIP;trustmebro',
        'extension-dir': {
            'manifest.json': validManifest,
        },
        'extension-dir-but-invalid-manifest': {
            'manifest.json': invalidManifest,
        },
        'empty-dir': {},
        'manifest.json': validManifest,
        'package.json': '{"webExt": {"sourceDir": "extension-dir"}}',
    });
}

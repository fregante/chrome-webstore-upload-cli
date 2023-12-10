import path from 'node:path';
import test from 'ava';
import mockFs from 'mock-fs';
import findSource from '../find-source.js';

const validManifest = '{"manifest_version": 2}';
const invalidManifest = '{"version": 2}';;

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

test('Uses the provided source zip', t => {
    const source = 'extension.zip';
    const result = findSource(source);

    t.is(result, path.resolve(source));
});

test('Uses the provided source directory', t => {
    const source = 'extension-dir';
    const result = findSource(source);

    t.is(result, path.resolve(source));
});

test('Uses the source directory from package.json', t => {
    const result = findSource();

    t.is(result, path.resolve('extension-dir'));
});

test('Throws if the provided source zip does not exist', t => {
    const source = 'missing.zip';
    const error = t.throws(() => findSource(source));

    t.is(error.message, `Zipped extension not found: ${path.resolve(source)}`);
});

test('Throws if the provided source directory does not exist', t => {
    const source = 'missing-dir';
    const error = t.throws(() => findSource(source));

    t.is(error.message, `The directory was not found: ${path.resolve(source)}`);
});

test('Throws if the provided source directory does not contain a manifest.json', t => {
    const source = 'empty-dir';
    const error = t.throws(() => findSource(source));

    t.is(error.message, `The directory does not contain manifest.json: ${path.resolve(source)}`);
});

test('Throws if the provided source directory does not contain a valid manifest.json', t => {
    const source = 'extension-dir-but-invalid-manifest';
    const error = t.throws(() => findSource(source));

    t.is(error.message, `The directory does not contain a valid manifest.json: ${path.resolve(source)}`);
});

test('Throws if the source directory from package.json does not exist', t => {
    mockFs({
        'package.json': '{"webExt": {"sourceDir": "missing-dir"}}',
    });

    const error = t.throws(() => findSource());

    t.is(error.message, `Reading webExt.sourceDir from package.json, the directory was not found: ${path.resolve('missing-dir')}`);
});

test('Throws if the source directory from package.json does not contain a manifest.json', t => {
    mockFs({
        'package.json': '{"webExt": {"sourceDir": "empty-dir"}}',
        'empty-dir': {},
    });

    const error = t.throws(() => findSource());

    t.is(error.message, `Reading webExt.sourceDir from package.json, the directory does not contain manifest.json: ${path.resolve('empty-dir')}`);
});

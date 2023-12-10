import path from 'node:path';
import test from 'ava';
import mockFs from 'mock-fs';
import findSource from '../find-source.js';
import { mockFileSystem } from './helpers/stubs.js';

mockFileSystem();

test.serial('Uses the provided source zip', async t => {
    const source = 'extension.zip';
    const result = await findSource(source);

    t.is(result, path.resolve(source));
});

test.serial('Uses the provided source directory', async t => {
    const source = 'extension-dir';
    const result = await findSource(source);

    t.is(result, path.resolve(source));
});

test.serial('Uses the source directory from package.json', async t => {
    const result = await findSource();

    t.is(result, path.resolve('extension-dir'));
});

test.serial('Throws if the provided source zip does not exist', async t => {
    const source = 'missing.zip';
    await t.throwsAsync(async () => findSource(source), {
        message: `Zipped extension not found: ${path.resolve(source)}`,
    });
});

test.serial('Throws if the provided source directory does not exist', async t => {
    const source = 'missing-dir';
    await t.throwsAsync(async () => findSource(source), {
        message: `The directory was not found: ${path.resolve(source)}`,
    });
});

test.serial('Throws if the provided source directory does not contain a manifest.json', async t => {
    const source = 'empty-dir';
    await t.throwsAsync(async () => findSource(source), {
        message: `The directory does not contain manifest.json: ${path.resolve(source)}`,
    });
});

test.serial('Throws if the provided source directory does not contain a valid manifest.json', async t => {
    const source = 'extension-dir-but-invalid-manifest';
    await t.throwsAsync(async () => findSource(source), {
        message: `The directory does not contain a valid manifest.json: ${path.resolve(source)}`,
    });
});

test.serial('Throws if the source directory from package.json does not exist', async t => {
    mockFs({
        'package.json': '{"webExt": {"sourceDir": "missing-dir"}}',
    });

    await t.throwsAsync(async () => findSource(), {
        message: `Reading webExt.sourceDir from package.json, the directory was not found: ${path.resolve('missing-dir')}`,
    });
});

test.serial('Throws if the source directory from package.json does not contain a manifest.json', async t => {
    mockFs({
        'package.json': '{"webExt": {"sourceDir": "empty-dir"}}',
        'empty-dir': {},
    });

    await t.throwsAsync(async () => findSource(), {
        message: `Reading webExt.sourceDir from package.json, the directory does not contain manifest.json: ${path.resolve('empty-dir')}`,
    });
});

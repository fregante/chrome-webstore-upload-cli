#!/usr/bin/env node
import process from 'node:process';
import { init, errorHandler } from './core.js';

try {
    await init();
} catch (error) {
    errorHandler(error);
    process.exitCode = 1;
}

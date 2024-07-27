#!/usr/bin/env node
import { init, errorHandler } from './core.js';

try {
    await init();
} catch (error) {
    errorHandler(error);
}

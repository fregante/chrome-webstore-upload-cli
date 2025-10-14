#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join(__dirname, 'source');
const distDir = path.join(__dirname, 'distribution');

async function build() {
    // Clean distribution directory
    try {
        await fs.rm(distDir, { recursive: true, force: true });
    } catch {}
    
    // Create distribution directory
    await fs.mkdir(distDir, { recursive: true });
    
    // Copy all JS files from source to distribution
    const files = await fs.readdir(sourceDir);
    
    for (const file of files) {
        if (file.endsWith('.js')) {
            const sourcePath = path.join(sourceDir, file);
            const distPath = path.join(distDir, file);
            await fs.copyFile(sourcePath, distPath);
            console.log(`Copied ${file} to distribution/`);
        }
    }
    
    console.log('Build completed successfully!');
}

build().catch(error => {
    console.error('Build failed:', error);
    process.exit(1);
});

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const meow = require('meow');
const webstore = require('chrome-webstore-upload');

const cli = meow(`
    Usage
      $ webstore <command>

    where <command> is one of:
        upload, publish

    Options
      --extension-id    Don't overwrite the destination
      --client-id       Preserve path structure
      --client-secret   Working directory for files
      --refresh-token   Rename all <source> filenames to <filename>

    Options (alternative)
        All Options can be set through environment variables, using the constant-cased name of the option

    Examples
      Upload new extension archive to the Chrome Web Store
      $ webstore upload extension.zip --extension-id $EXTENSION_ID --client-id $CLIENT_ID --client-secret $CLIENT_SECRET --refresh-token $REFRESH_TOKEN

      Publish extension (with CLIENT_ID, CLIENT_SECRET, and REFRESH_TOKEN set as env variables)
      $ webstore publish --client-id elomekmlfonmdhmpmdfldcjgdoacjcba
`, {
    string: ['_']
});

const zipPath = cli.input.pop();
const commands = cli.input;
const isUpload = commands.includes('upload');
const isPublish = commands.includes('publish');

if (!(isUpload || isPublish)) {
    cli.showHelp(1);
}

const env = {
    extensionId: process.env.EXTENSION_ID,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN
};
const client = webstore(Object.assign(env, cli.flags));

if (isUpload) {
    const fullPath = path.join(process.cwd(), zipPath);
    const zipStream = fs.createReadStream(fullPath);

    client.uploadExisting(zipStream).then(res => {
        // TODO: Messaging to user on success/failure of upload
        console.log(res);
    }).catch(errorHandler);
}

if (isPublish) {
    client.publish().then(res => {
        // TODO: Messaging to user on success/failure of publish
        console.log(res);
    }).catch(errorHandler);
}

function errorHandler(err) {
    console.error(err);
    process.exit(1);
}

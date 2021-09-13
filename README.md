# Web Store Upload CLI

A CLI wrapper around the [Web Store Upload](https://github.com/fregante/chrome-webstore-upload) module.

The following projects use this package to facilitate auto-deployment of extensions
- [GifHub](https://github.com/DrewML/GifHub)
- [Octo Preview](https://github.com/DrewML/octo-preview)
- [GhostText](https://github.com/fregante/GhostText)
- [npmhub](https://github.com/npmhub/npmhub)
- [OctoLinker](https://github.com/octolinker/browser-extension)
- [Refined GitHub](https://github.com/sindresorhus/refined-github)
- [Refined Twitter](https://github.com/sindresorhus/refined-twitter)
- [FACEIT Enhancer](https://github.com/faceit-enhancer/faceit-enhancer)

## Minimum node.js version

You must be using a `node.js` version >= `6.0.0`.

## Install

```shell
## Globally
npm install -g chrome-webstore-upload-cli

## In a project
npm install --save-dev chrome-webstore-upload-cli
```

## Setup

You will need a Google API `clientId`, a `clientSecret` and a `refreshToken`. Read [the guide.](https://github.com/fregante/chrome-webstore-upload/blob/master/How%20to%20generate%20Google%20API%20keys.md)

You can also [set up Travis to automatically upload your extension.](./Travis%20autoupload%20guide.md)

## Usage

```
$ webstore --help

  CLI Utility to quickly upload + publish extensions to the Chrome Web Store

  Usage
    $ webstore <command>

  where <command> is one of
      upload, publish

  Options
    --source          Path to either a zip file, or a directory to be zipped (Defaults to cwd if not specified)
    --extension-id      The ID of the Chrome Extension (environment variable EXTENSION_ID)
    --client-id         OAuth2 Client ID (environment variable CLIENT_ID)
    --client-secret     OAuth2 Client Secret (environment variable CLIENT_SECRET)
    --refresh-token     OAuth2 Refresh Token (environment variable REFRESH_TOKEN)
    --auto-publish      Can be used with the "upload" command
    --trusted-testers   Can be used with the "publish" command

  Examples
    Upload new extension archive to the Chrome Web Store
    $ webstore upload --source extension.zip --extension-id $EXTENSION_ID --client-id $CLIENT_ID --client-secret $CLIENT_SECRET --refresh-token $REFRESH_TOKEN

    Publish extension (with CLIENT_ID, CLIENT_SECRET, and REFRESH_TOKEN set as env variables)
    $ webstore publish --extension-id elomekmlfonmdhmpmdfldcjgdoacjcba
```

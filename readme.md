# chrome-webstore-upload-cli

> Upload/Publish Chrome Web Store extensions from the CLI

A CLI wrapper around the [Web Store Upload](https://github.com/fregante/chrome-webstore-upload) module.

## Install

```shell
npm install chrome-webstore-upload-cli
```

## Setup

You will need a Google API `clientId`, `clientSecret`, and a `refreshToken`. Read [the guide.](https://github.com/fregante/chrome-webstore-upload-keys)

You can also automatically upload your extension on:

- GitHub Actions, [workflow including uploading to Mozilla Addons](https://github.com/fregante/ghatemplates/blob/main/webext/release.yml)

## Usage

```
$ chrome-webstore-upload --help

  CLI Utility to quickly upload + publish extensions to the Chrome Web Store

  Usage
    $ chrome-webstore-upload [command]

  where [command] can be one of
      upload, publish

  if the command is missing, it will both upload and publish the extension.

  Options
    --source            Path to either a zip file or a directory to be zipped. Defaults to the value of webExt.sourceDir in package.json or the current directory if not specified
    --extension-id      The ID of the Chrome Extension (environment variable EXTENSION_ID)
    --client-id         OAuth2 Client ID (environment variable CLIENT_ID)
    --client-secret     OAuth2 Client Secret (environment variable CLIENT_SECRET)
    --refresh-token     OAuth2 Refresh Token (environment variable REFRESH_TOKEN)
    --auto-publish      Can be used with the "upload" command (deprecated, use `chrome-webstore-upload` without a command instead)
    --trusted-testers   Can be used with the "publish" command
    --deploy-percentage Can be used with the "publish" command. Defaults to 100

  Examples
    Upload and publish a new version, using existing environment variables and the default value for --source
    $ chrome-webstore-upload

    Upload new extension archive to the Chrome Web Store
    $ chrome-webstore-upload upload --source my-custom-zip.zip

    Publish the last uploaded version (whether it was uploaded via web UI or via CLI)
    $ chrome-webstore-upload publish --extension-id elomekmlfonmdhmpmdfldcjgdoacjcba
```

## Examples

The following projects use this package to facilitate auto-deployment of extensions

- [GifHub](https://github.com/DrewML/GifHub)
- [Octo Preview](https://github.com/DrewML/octo-preview)
- [GhostText](https://github.com/fregante/GhostText)
- [npmhub](https://github.com/npmhub/npmhub)
- [OctoLinker](https://github.com/octolinker/browser-extension)
- [Refined GitHub](https://github.com/sindresorhus/refined-github)
- [FACEIT Enhancer](https://github.com/faceit-enhancer/faceit-enhancer)

## Related

- [webext-storage-cache](https://github.com/fregante/webext-storage-cache) - Map-like promised cache storage with expiration. Chrome and Firefox
- [webext-dynamic-content-scripts](https://github.com/fregante/webext-dynamic-content-scripts) - Automatically registers your content_scripts on domains added via permission.request
- [Awesome-WebExtensions](https://github.com/fregante/Awesome-WebExtensions) - A curated list of awesome resources for WebExtensions development.
- [More…](https://github.com/fregante/webext-fun)

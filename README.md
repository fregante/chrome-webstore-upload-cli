# chrome-webstore-upload-cli

> Upload/Publish Chrome Web Store extensions from the CLI

A CLI wrapper around the [Web Store Upload](https://github.com/fregante/chrome-webstore-upload) module.

## Install

```shell
npm install chrome-webstore-upload-cli
```

## Setup

You will need a Google API `clientId` and a `refreshToken`. Read [the guide.](https://github.com/fregante/chrome-webstore-upload/blob/master/How%20to%20generate%20Google%20API%20keys.md)

Note: If you created the APIs before version 2.0.0 (September 2021), you might have to follow [the guide](./How%20to%20generate%20Google%20API%20keys.md) again. [Leave a comment](https://github.com/fregante/chrome-webstore-upload-cli/issues/44) if that happened to you.

You can also automatically upload your extension on:

- GitHub Actions, [workflow including uploading to Mozilla Addons](https://github.com/fregante/ghatemplates/blob/main/webext/release.yml)
- Travis, [guide](./Travis%20autoupload%20guide.md)

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
- [More…](https://github.dihe.moe/fregante/webext-fun)

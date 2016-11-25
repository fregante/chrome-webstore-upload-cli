# Web Store Upload CLI

[![CI status](https://travis-ci.org/DrewML/chrome-webstore-upload-cli.svg)](https://travis-ci.org/DrewML/chrome-webstore-upload-cli)

A CLI wrapper around the [Web Store Upload](https://github.com/DrewML/chrome-webstore-upload) module.

The following projects use this package to facilitate auto-deployment of extensions
- [GifHub](https://github.com/DrewML/GifHub)
- [Octo Preview](https://github.com/DrewML/octo-preview)
- [Running Redmine](https://github.com/paulmolluzzo/running-redmine)

## Minimum node.js version

You must be using a `node.js` version >= `6.0.0`.

## Install

```shell
## Globally
npm install -g chrome-webstore-upload-cli

## In a project
npm install --save-dev chrome-webstore-upload-cli
```

## Obtaining API Access

0. Visit the [Developer Console](https://console.developers.google.com/apis/api/chromewebstore/overview).
0. Click the button to create a new project (confusing, but totally separate from the project for your extension). You can literally name it anything (you'll likely never see the name again).
0. When redirected back to the `Overview` page, click `Enable` for the API
0. Click the `Credentials` tab on the left-hand side of the page
0. Click `Create credentials → OAuth Client ID`
![](https://cloud.githubusercontent.com/assets/5233399/16550256/e543c3fe-416d-11e6-94d7-692a47372843.png)

0. Go through the `Configure consent` screen prompt (you just need to enter a project name)
![](https://cloud.githubusercontent.com/assets/5233399/16550261/fa8e9d6a-416d-11e6-9a99-636d3c54e271.png)

0. You should then be given a `client_id` and `client_secret`
0. Now, go to [this page](https://developer.chrome.com/webstore/using_webstore_api), and start at step 9. Make sure you go through the OAuth acceptance page logged in under the account that owns the extension you're planning to publish.
0. Once you've jumped through all the hoops outlined in that document, you should have your `client_id`, `client_secret`, and `refresh_token`.

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
    --extension-id    The ID of the Chrome Extension
    --client-id       OAuth2 Client ID
    --client-secret   OAuth2 Client Secret
    --refresh-token   OAuth2 Refresh Token
    --auto-publish    Can be used with the "upload" command

  Examples
    Upload new extension archive to the Chrome Web Store
    $ webstore upload --source extension.zip --extension-id $EXTENSION_ID --client-id $CLIENT_ID --client-secret $CLIENT_SECRET --refresh-token $REFRESH_TOKEN

    Publish extension (with CLIENT_ID, CLIENT_SECRET, and REFRESH_TOKEN set as env variables)
    $ webstore publish --client-id elomekmlfonmdhmpmdfldcjgdoacjcba
```

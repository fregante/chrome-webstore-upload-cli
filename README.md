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

## Usage

```
$ webstore --help

  CLI Utility to quickly upload + publish extensions to the Chrome Web Store

  Usage
    $ webstore <command>

  where <command> is one of
      upload, publish

  Options
    --source          Path to either a zip file, or a directory to be zipped
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

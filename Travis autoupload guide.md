# Travis autoupload guide

With this setup, you can automatically deploy your extension when creating a tag.

## Setup

0. Enable your repo on travis
0. Create a `.travis.yml` file and set your `EXTENSION_ID`:

    ```yaml
    language: node_js
    node_js:
      - '7'
    env:
      - EXTENSION_ID=kbbbjimdjbjclaebffknlabpogocablj
    deploy:
      provider: script
      script: npm run release
      on:
        branch: master
        tags: true
    ```

0. Create your `release` script in `package.json`:

    ```json
    {
      "devDependencies": {
        "chrome-webstore-upload-cli": "^1.0.0"
      },
      "scripts": {
        "release": "webstore upload --source=path/to/extension --auto-publish"
      }
    }
    ```


## Usage

0. Update the version in your `manifest.json`, otherwise the publish will fail.
0. [Create a git tag via cli](https://stackoverflow.com/questions/18216991/create-a-tag-in-github-repository) or [via GitHub's interface](https://help.github.com/articles/creating-releases/)

Done! Travis should run the `release` npm script and your version should appear on the webstore soon after.

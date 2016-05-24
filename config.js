module.exports = function(input, flags) {
    const env = {
        extensionId: process.env.EXTENSION_ID,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    };

    const zipPath = input.pop();
    const commands = input;
    console.log(commands);
    console.log(zipPath);

    return {
        zipPath,
        apiConfig: Object.assign(env, flags),
        isUpload: commands.includes('upload'),
        isPublish: commands.includes('publish')
    };
};

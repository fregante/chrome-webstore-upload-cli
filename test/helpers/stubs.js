module.exports = {
    stubProcessExit(stub) {
        const old = process.exit;
        process.exit = stub;
        return () => {
            process.exit = old;
        };
    },

    stubConsoleLog(stub) {
        const old = console.log;
        console.log = stub;
        return () => {
            console.log = old;
        };
    },
};

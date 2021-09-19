import process from 'node:process';

export function stubProcessExit(stub) {
    const old = process.exit;
    process.exit = stub;
    return () => {
        process.exit = old;
    };
}

export function stubConsoleLog(stub) {
    const old = console.log;
    console.log = stub;
    return () => {
        console.log = old;
    };
}

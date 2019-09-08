var spawn = require('child_process').spawn;
const version = process.env.INPUT_VERSION;
const make_default = process.env.INPUT_MAKE_DEFAULT;
const proc = spawn("rustup", ["toolchain", "install", version], { "stdio": 'inherit' });

proc.on("close", (code) => {
    if(code != 0) {
        process.exit(code);
    }

    if(make_default) {
        console.log(`Making ${version} the default toolchain`);
        const proc = spawn("rustup", ["default", version]);
        proc.on("close", (code) => {
            process.exit(code);
        })
    }
});

var spawn = require('child_process').spawn;
const version = process.env.INPUT_VERSION;
const make_default = process.env.INPUT_MAKE_DEFAULT;

function install_toolchain() {
    const proc = spawn("rustup", ["toolchain", "install", version], { "stdio": 'inherit' });

    proc.on("close", (code) => {
        if(code != 0) {
            process.exit(code);
        }

        if(make_default) {
            set_as_default();
        }
    });

    proc.on("error", (err) => {
        console.log(`Error while installing toolchain: ${err}`);
        process.exit(1)
    });
}

function set_as_default() {
    console.log(`Making ${version} the default toolchain`);
    const proc = spawn("rustup", ["default", version]);
    proc.on("close", (code) => {
        process.exit(code);
    })
    proc.on("error", (err) => {
        console.log(`Error while setting default toolchain: ${err}`);
        process.exit(1)
    });
}

install_toolchain();

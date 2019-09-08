var spawn = require('child_process').spawn;

const version = process.env.INPUT_VERSION;
const make_default = process.env.INPUT_MAKE_DEFAULT;
const components = process.env.INPUT_COMPONENTS;

function spawnAsync(command, args, options) {
    return new Promise((resolve, reject) => {
        const proc = spawn(command, args, options);

        proc.on("error", (err) => {
            reject(err);
        });

        proc.on("close", (code) => {
            if(code == 0) {
                resolve();
            } else {
                reject(code);
            }
        });
    });
}

async function install_toolchain() {
    await spawnAsync("rustup", ["toolchain", "install", version], { "stdio": 'inherit' });
}

async function set_as_default(rustup) {
    await spawnAsync(rustup, ["default", version], { "stdio": 'inherit' });
}

async function install_rustup_and_toolchain() {
    const command = `curl https://sh.rustup.rs -sSf | sh -s -- -y --default-toolchain ${version}`
    await spawnAsync(command, [], { "stdio": "inherit", "shell": true });
    const new_path = `${process.env.HOME}/.cargo/bin`
    console.log(`::add-path::${new_path}`);
    return `${new_path}/rustup`;
}

async function install_components(rustup) {
    if(components == "") {
        console.log("No components to install");
    } else {
        const command = `${rustup} component add --toolchain ${version} ${components}`;
        await spawnAsync(command, [], { "stdio": "inherit", "shell": true });
    }
}

async function main() {
    try {
        console.log("::set-env name=RUST_BACKTRACE::1")
        var rustup = "rustup";
        if(process.platform === "darwin") {
            console.log("Detected macOS, installing rustup as well");
            rustup = await install_rustup_and_toolchain();
        } else {
            await install_toolchain();
        }

        if(make_default) {
            await set_as_default(rustup);
        }
        await install_components(rustup);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}

main();

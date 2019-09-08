var spawn = require('child_process').spawn;
const version = process.env.INPUT_VERSION;
const make_default = process.env.INPUT_MAKE_DEFAULT;
const components = process.env.INPUT_COMPONENTS;

function install_toolchain() {
    const proc = spawn("rustup", ["toolchain", "install", version], { "stdio": 'inherit' });

    proc.on("close", (code) => {
        if(code != 0) {
            process.exit(code);
        }

        if(make_default) {
            set_as_default();
        } else {
            install_components("rustup");
        }
    });

    proc.on("error", (err) => {
        console.log(`Error while installing toolchain: ${err}`);
        process.exit(1)
    });
}

function set_as_default() {
    const proc = spawn("rustup", ["default", version], { "stdio": 'inherit' });
    proc.on("close", (code) => {
        if(code != 0) {
            process.exit(code);
        }

        install_components("rustup");
    })
    proc.on("error", (err) => {
        console.log(`Error while setting default toolchain: ${err}`);
        process.exit(1)
    });
}

function install_rustup_and_toolchain() {
    const command = `curl https://sh.rustup.rs -sSf | sh -s -- -y --default-toolchain ${version}`
    const proc = spawn(command, [], { "stdio": "inherit", "shell": true });
    proc.on("close", (code) => {
        const new_path = `${process.env.HOME}/.cargo/bin`
        console.log(`::add-path::${new_path}`);
        if(code != 0) {
            process.exit(code);
        }
        install_components(`${new_path}/rustup`);
    })
    proc.on("error", (err) => {
        console.log(`Error while installing rust: ${err}`);
        process.exit(1);
    });
}

function install_components(rustup) {
    if(components == "") {
        console.log("No components to install");
        process.exit(0);
    }
    const command = `rustup component add --toolchain ${version} ${components}`;
    const proc = spawn(command, [], { "stdio": "inherit", "shell": true });
    proc.on("close", (code) => {
        process.exit(code);
    })
    proc.on("error", (err) => {
        console.log(`Error while installing components: ${err}`);
        process.exit(1);
    });
}

if(process.platform === "darwin") {
    console.log("Detected macOS, installing rustup as well");
    install_rustup_and_toolchain();
} else {
    install_toolchain();
}

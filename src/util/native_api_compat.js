function getNativeRequire() {
    if (typeof requireNativeModule === "function") {
        return requireNativeModule;
    }
}

function requireNativeApi(moduleName, options = {}) {
    const nativeRequire = getNativeRequire();
    if (!nativeRequire) {
        return;
    }
    try {
        return nativeRequire(moduleName, options);
    } catch (err) {
        if (moduleName.startsWith("node:")) {
            console.warn(`[YSM Utils] Failed to require native API "${moduleName}".`, err);
            return;
        }
        try {
            return nativeRequire(`node:${moduleName}`, options);
        } catch (nodeErr) {
            console.warn(`[YSM Utils] Failed to require native API "${moduleName}".`, nodeErr);
        }
    }
}

function unwrapDialogOptions(args) {
    return args.length > 1 ? args[1] : args[0];
}

function createDialogCompat(dialogApi) {
    return new Proxy(dialogApi, {
        get(target, property) {
            const value = target[property];
            if (typeof value !== "function") {
                return value;
            }
            return (...args) => value(unwrapDialogOptions(args));
        }
    });
}

export function initNativeApiCompat() {
    if (!globalThis.fs) {
        globalThis.fs = requireNativeApi("fs", {
            optional: false,
            message: "YSM Utils needs file system access to read, edit, import, export, and convert YSM model packs."
        });
    }

    if (!globalThis.process) {
        globalThis.process = requireNativeApi("process", {
            optional: false,
            message: "YSM Utils needs platform information to compare file paths correctly."
        });
    }

    const dialogApi = globalThis.electron?.dialog ? undefined : requireNativeApi("dialog", {
        optional: false,
        message: "YSM Utils needs native dialogs so you can choose YSM model folders and files."
    });
    const shellApi = globalThis.electron?.shell ? undefined : requireNativeApi("shell", {
        optional: false,
        message: "YSM Utils needs shell access to open folders and move replaced files to the trash."
    });

    if (dialogApi || shellApi) {
        globalThis.electron = {
            ...(globalThis.electron ?? {}),
            ...(dialogApi ? {dialog: createDialogCompat(dialogApi)} : {}),
            ...(shellApi ? {shell: shellApi} : {})
        };
    }

    globalThis.currentwindow ??= null;

    if (!globalThis.fs || !globalThis.electron?.dialog || !globalThis.electron?.shell || !globalThis.process) {
        throw new Error("YSM Utils cannot load because required Blockbench native API permissions were not granted.");
    }
}

import {dirname as _dirname} from "path";

// 5.x 的 Blockbench 需要授权才可以使用原生模块，4.x 的 Blockbench 则不需要授权
export const PLUGINS_FS = Blockbench.isNewerThan("4.99") ? requireNativeModule("fs") : fs;
export const PLUGINS_SHELL = Blockbench.isNewerThan("4.99") ? requireNativeModule("shell") : electron.shell;
export const PLUGINS_DIALOG = Blockbench.isNewerThan("4.99") ? requireNativeModule("dialog") : electron.dialog;

/**
 * Create folders recursively
 * @param {String} dirname Folders name
 */
export function mkdirs(dirname) {
    if (PLUGINS_FS.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirs(_dirname(dirname))) {
            PLUGINS_FS.mkdirSync(dirname);
            return true;
        }
    }
}

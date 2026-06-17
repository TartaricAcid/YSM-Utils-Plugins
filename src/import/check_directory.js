import {oldVersionTransform} from "./old_version_transform.js";
import {join} from "path";
import {openImportDialog} from "./open_import_dialog.js";
import {PLUGINS_DIALOG, PLUGINS_FS} from "../util/native_module.js";

async function doOldVersionTransform(packDirectory, isVersion114) {
    let result = await PLUGINS_DIALOG.showOpenDialog(currentwindow, {
        title: tl("menu.ysm_utils.old_version_transform.select_output_directory"),
        properties: ["openDirectory"]
    });
    if (result.canceled) {
        return;
    }
    let selectFilePaths = result.filePaths;
    if (selectFilePaths && selectFilePaths[0]) {
        return oldVersionTransform(packDirectory, selectFilePaths[0], isVersion114);
    }
}

/**
 * 检查文件夹是否符合规范
 */
export function checkDirectory(packDirectory) {
    // 1.2.0 版本格式检查
    let ysmJsonPath = join(packDirectory, "ysm.json");
    if (PLUGINS_FS.existsSync(ysmJsonPath)) {
        return true;
    }

    // 1.1.4/1.1.5 版本格式检查
    let versionType = undefined;
    let infoJson = join(packDirectory, "info.json");
    let mainJson = join(packDirectory, "main.json");
    if (PLUGINS_FS.existsSync(infoJson)) {
        versionType = "1.1.5";
    } else if (PLUGINS_FS.existsSync(mainJson)) {
        versionType = "1.1.4";
    }

    if (versionType) {
        Blockbench.showMessageBox({
            icon: "fa-warning",
            title: tl("level.ysm_utils.warning"),
            message: tl("menu.ysm_utils.load_info_menu.transform_model"),
            width: 600,
            buttons: [tl("dialog.confirm"), tl("dialog.cancel")],
            confirm: 0,
            cancel: 1
        }, (button) => {
            if (button === 0) {
                doOldVersionTransform(packDirectory, versionType === "1.1.4").then(result => {
                    if (result) {
                        openImportDialog(result);
                    }
                });
            }
        });
        return false;
    }

    Blockbench.showMessageBox({
        icon: "fa-warning",
        title: tl("level.ysm_utils.error"),
        message: tl("menu.ysm_utils.load_info_menu.directory_error")
    });

    return false;
}

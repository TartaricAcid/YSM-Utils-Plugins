import {join} from "path";
import {arePathsEqual, createDirectories} from "../util/path_util.js";

export async function changeCurrentFile(packDir, pathValue, defaultDir, extension) {
    let result = await electron.dialog.showOpenDialog(currentwindow, {
        title: tl("menu.ysm_utils.load_info_menu.files.select_files"),
        filters: [{
            extensions: [extension],
            name: extension,
        }],
        properties: ["openFile"]
    });

    if (result.filePaths[0]) {
        console.assert(defaultDir !== "");
        // 路径为空，说明原文件不存在，那么给一个默认名
        let srcFilePath;
        if (!pathValue || pathValue.length === 0) {
            pathValue = join(defaultDir, pathToName(result.filePaths[0], true));
            srcFilePath = join(packDir, pathValue);
            // 看看文件夹存不存在，不存在我们创一个空的
            await createDirectories(srcFilePath);
        } else {
            srcFilePath = join(packDir, pathValue);
        }
        let destFilePath = result.filePaths[0];
        // 路径相同的，不进行任何操作
        if (arePathsEqual(srcFilePath, destFilePath)) {
            Blockbench.showQuickMessage(tl("menu.ysm_utils.load_info_menu.files.same_file"), 2000);
            return pathValue;
        }
        // 将原文件丢到回收站
        if (fs.existsSync(srcFilePath)) {
            await electron.shell.trashItem(srcFilePath);
        }
        // 复制到指定目录下
        if (fs.existsSync(destFilePath)) {
            let error = await fs.promises.copyFile(destFilePath, srcFilePath);
            if (!error) {
                Blockbench.showQuickMessage(tl("menu.ysm_utils.load_info_menu.files.replace_success"), 2000);
            }
        }
    }

    return pathValue;
}

export async function removeCurrentFile(packDir, pathValue, callback) {
    // 路径为空，不进行任何操作
    if (!pathValue || pathValue.length === 0) {
        return;
    }
    let srcFilePath = join(packDir, pathValue);
    // 原文件不存在，清空数值即可
    if (!fs.existsSync(srcFilePath)) {
        callback();
        return;
    }
    Blockbench.showMessageBox({
        icon: "fa-warning",
        title: tl("level.ysm_utils.warning"),
        message: tl("menu.ysm_utils.load_info_menu.files.delete_files"),
        buttons: [tl("dialog.confirm"), tl("dialog.cancel")],
        confirm: 0,
        cancel: 1
    }, (button) => {
        if (button === 0) {
            let srcFilePath = join(packDir, pathValue);
            // 将原文件丢到回收站
            if (fs.existsSync(srcFilePath)) {
                electron.shell.trashItem(srcFilePath);
            }
            callback();
        }
    });
}
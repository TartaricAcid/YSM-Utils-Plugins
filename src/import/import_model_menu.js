import metadataVue from "./metadata.vue";
import propertiesVue from "./properties.vue";
import playerFilesVue from "./player_files.vue";
import arrowFilesVue from "./arrow_files.vue";
import {join} from "path";
import {oldVersionTransform} from "./old_version_transform.js";
import {createHash} from "crypto";

export let importModelMenuAction = new Action("ysm_utils.import_model_menu", {
    name: "menu.ysm_utils.import_model_menu.name",
    icon: "fa-file-alt",
    click: function () {
        electron.dialog.showOpenDialog(currentwindow, {
            title: tl("menu.ysm_utils.import_model_menu.name"),
            properties: ["openDirectory"]
        }).then(result => {
            if (result.canceled) {
                return;
            }
            let selectFilePaths = result.filePaths;
            if (selectFilePaths && selectFilePaths[0] && checkDirectory(selectFilePaths[0])) {
                openImportMenu(selectFilePaths[0]);
            }
        });
    }
});

function doOldVersionTransform(packDirectory, isVersion114) {
    electron.dialog.showOpenDialog(currentwindow, {
        title: tl("menu.ysm_utils.old_version_transform.select_output_directory"),
        properties: ["openDirectory"]
    }).then(result => {
        if (result.canceled) {
            return;
        }
        let selectFilePaths = result.filePaths;
        if (selectFilePaths && selectFilePaths[0]) {
            oldVersionTransform(packDirectory, selectFilePaths[0], isVersion114);
        }
    });
}

function checkDirectory(packDirectory) {
    // 1.2.0 版本格式检查
    let ysmJsonPath = join(packDirectory, "ysm.json");
    if (fs.existsSync(ysmJsonPath)) {
        return true;
    }

    // 1.1.4/1.1.5 版本格式检查
    let versionType = undefined;
    let infoJson = join(packDirectory, "info.json");
    let mainJson = join(packDirectory, "main.json");
    if (fs.existsSync(infoJson)) {
        versionType = "1.1.5";
    } else if (fs.existsSync(mainJson)) {
        versionType = "1.1.4";
    }

    if (versionType) {
        Blockbench.showMessageBox({
            icon: "fa-warning",
            title: tl("level.ysm_utils.warning"),
            message: tl("menu.ysm_utils.import_model_menu.transform_model"),
            width: 600,
            buttons: [tl("dialog.confirm"), tl("dialog.cancel")],
            confirm: 0,
            cancel: 1
        }, (button) => {
            if (button === 0) {
                doOldVersionTransform(packDirectory, versionType === "1.1.4");
            }
        });
        return false;
    }

    Blockbench.showMessageBox({
        icon: "fa-warning",
        title: tl("level.ysm_utils.error"),
        message: tl("menu.ysm_utils.import_model_menu.directory_error")
    });

    return false;
}


function onDialogCancel(ysmJson, ysmJsonPath, sha256Cache) {
    // 关闭页面时，计算一次哈希值
    let sha256 = getSha256(ysmJson);
    if (sha256 === sha256Cache) {
        return true;
    }
    let button = electron.dialog.showMessageBoxSync({
        type: "warning",
        title: tl("level.ysm_utils.warning"),
        message: tl("menu.ysm_utils.import_model_menu.save_tip"),
        buttons: [tl("menu.ysm_utils.save"), tl("menu.ysm_utils.exit_without_save"), tl("dialog.cancel")],
    });
    if (button === 0) {
        saveYsmFile(ysmJson, ysmJsonPath);
        return true;
    } else if (button === 1) {
        // 直接退出
        return true;
    }
    return false;
}

/**
 * 删除空白数据
 */
function saveYsmFile(ysmJson, ysmJsonPath) {
    let result = autoStringify(ysmJson);
    fs.writeFileSync(ysmJsonPath, result);
    Blockbench.showQuickMessage(tl("menu.ysm_utils.save_success"), 3000);
}

function openImportMenu(packDirectory) {
    let ysmJsonPath = join(packDirectory, "ysm.json");
    let ysmJson = autoParseJSON(fs.readFileSync(ysmJsonPath, "utf8"), true);
    ysmJson = normalization(ysmJson);
    // 开始之前计算一次哈希值，用来判断是否已经修改了内容，用于提示保存
    let sha256Cache = getSha256(ysmJson);

    let importModelMenuDialog = new Dialog({
        title: "menu.ysm_utils.import_model_menu.title",
        cancel_on_click_outside: false,
        width: 1000,
        onCancel: function (event) {
            return onDialogCancel(ysmJson, ysmJsonPath, sha256Cache);
        },
        onConfirm(formResult) {
            saveYsmFile(ysmJson, ysmJsonPath);
        },
        sidebar: {
            pages: {
                "metadata": tl("menu.ysm_utils.import_model_menu.sidebar.metadata"),
                "properties": tl("menu.ysm_utils.import_model_menu.sidebar.properties"),
                "player_files": tl("menu.ysm_utils.import_model_menu.sidebar.player_files"),
                "arrow_files": tl("menu.ysm_utils.import_model_menu.sidebar.arrow_files")
            },
            page: "metadata",
            onPageSwitch(page) {
                if (importModelMenuDialog.content_vue.type !== page) {
                    importModelMenuDialog.content_vue.type = page;
                }
            }
        },
        component: {
            data() {
                return {
                    importModelMenuDialog: importModelMenuDialog,
                    ysmJson: ysmJson,
                    packDirectory: packDirectory,
                    type: "metadata"
                };
            },
            components: {
                metadataVue: metadataVue,
                propertiesVue: propertiesVue,
                playerFilesVue: playerFilesVue,
                arrowFilesVue: arrowFilesVue
            },
            template: `
                <div>
                    <metadataVue v-if="this.type==='metadata'"
                                 :import-model-menu-dialog='importModelMenuDialog'
                                 :ysm-json='ysmJson'
                                 :pack-directory='packDirectory'/>
                    <propertiesVue v-if="this.type==='properties'"
                                   :import-model-menu-dialog='importModelMenuDialog'
                                   :ysm-json='ysmJson'
                                   :pack-directory='packDirectory'/>
                    <playerFilesVue v-if="this.type==='player_files'"
                                    :import-model-menu-dialog='importModelMenuDialog'
                                    :ysm-json='ysmJson'
                                    :pack-directory='packDirectory'/>
                    <arrowFilesVue v-if="this.type==='arrow_files'"
                                   :import-model-menu-dialog='importModelMenuDialog'
                                   :ysm-json='ysmJson'
                                   :pack-directory='packDirectory'/>
                </div>`
        }
    });

    importModelMenuDialog.show();

    if (importModelMenuDialog.object && importModelMenuDialog.object.style) {
        importModelMenuDialog.object.style["max-width"] = "1000px";
        importModelMenuDialog.object.style["min-height"] = "600px";
    }
}

/**
 * 计算 ysmJson 的哈希值，用来判断是否进行了修改
 */
function getSha256(ysmJson) {
    return createHash("sha256")
        .update(JSON.stringify(ysmJson), "utf8")
        .digest("hex");
}

/**
 * 规格化 ysm.json 对象，方便后续 Vue 菜单显示
 */
function normalization(ysmJson) {
    ysmJson["spec"] = 2;

    // metadata 部分
    let metadata = ysmJson["metadata"] ??= {};
    metadata["name"] ??= "";
    metadata["tips"] ??= "";
    metadata["license"] ??= {
        "type": "All Rights Reserved",
        "desc:": ""
    };
    metadata["license"]["type"] ??= "All Rights Reserved";
    metadata["license"]["desc"] ??= "";
    metadata["authors"] ??= [];
    metadata["authors"].forEach(author => {
        author["name"] ??= "";
        author["avatar"] ??= "";
        author["role"] ??= "";
        author["contact"] ??= {};
        author["comment"] ??= "";
    });
    metadata["link"] ??= {
        "home": "",
        "donate": ""
    };
    metadata["link"]["home"] ??= "";
    metadata["link"]["donate"] ??= "";

    // properties 部分
    let properties = ysmJson["properties"] ??= {};
    properties["height_scale"] ??= 0.7;
    properties["width_scale"] ??= 0.7;
    properties["extra_animation"] ??= {
        "extra0": "",
        "extra1": "",
        "extra2": "",
        "extra3": "",
        "extra4": "",
        "extra5": "",
        "extra6": "",
        "extra7": ""
    };
    properties["preview_animation"] ??= "idle";
    properties["default_texture"] ??= "";
    properties["free"] ??= false;
    properties["render_layers_first"] ??= false;

    // files 部分
    let files = ysmJson["files"] ??= {};

    // player 部分
    let player = files["player"] ?? {};
    let animation = player["animation"] ??= {};
    animation["main"] ??= "";
    animation["arm"] ??= "";
    animation["extra"] ??= "";
    animation["tac"] ??= "";
    animation["carryon"] ??= "";
    animation["swem"] ??= "";
    animation["parcool"] ??= "";

    // texture 部分，将其全部修改为对象
    player["texture"] ??= [];
    player["texture"] = player["texture"].map(value => {
        if (typeof value == "string") {
            return {
                "uv": value,
                "normal": "",
                "specular": ""
            };
        } else {
            value["uv"] ??= "";
            value["normal"] ??= "";
            value["specular"] ??= "";
            return value;
        }
    });

    // arrow 部分
    let arrow = files["arrow"] ??= {
        "model": "",
        "animation": "",
        "texture": ""
    };
    arrow["model"] ??= "";
    arrow["animation"] ??= "";
    arrow["texture"] ??= "";

    return ysmJson;
}
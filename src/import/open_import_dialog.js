import {join} from "path";
import {loadNormalization} from "./load_normalization.js";
import metadataVue from "../vue/import/metadata.vue";
import propertiesVue from "../vue/import/properties.vue";
import playerFilesVue from "../vue/import/player_files.vue";
import arrowFilesVue from "../vue/import/arrow_files.vue";
import {createHash} from "crypto";
import {saveNormalization} from "./save_normalization.js";
import {addToYsmCache} from "../menu/cache_model_menu.js";

function onDialogCancel(ysmJson, ysmJsonPath, sha256Cache) {
    // 关闭页面时，计算一次哈希值
    let sha256 = getSha256(ysmJson);
    // 哈希值相同，说明文件没有做任何修改，直接关闭
    if (sha256 === sha256Cache) {
        return true;
    }
    // 否则强制提示是否保存？
    let button = electron.dialog.showMessageBoxSync({
        type: "warning",
        title: tl("level.ysm_utils.warning"),
        message: tl("menu.ysm_utils.import_model_menu.save_tip"),
        buttons: [tl("menu.ysm_utils.save"), tl("menu.ysm_utils.exit_without_save"), tl("dialog.cancel")],
    });
    if (button === 0) {
        // 保存并退出
        saveYsmFile(ysmJson, ysmJsonPath);
        return true;
    } else if (button === 1) {
        // 不保存直接退出
        return true;
    }
    // 不保存，但是也不退出
    return false;
}

/**
 * 删除空白数据
 */
function saveYsmFile(ysmJson, ysmJsonPath) {
    let result = autoStringify(saveNormalization(ysmJson));
    fs.writeFileSync(ysmJsonPath, result);
    Blockbench.showQuickMessage(tl("menu.ysm_utils.save_success"), 3000);
}

/**
 * 计算 ysmJson 的哈希值，用来判断是否进行了修改
 */
function getSha256(ysmJson) {
    return createHash("sha256")
        .update(JSON.stringify(ysmJson), "utf8")
        .digest("hex");
}

export function openImportDialog(packDirectory) {
    let ysmJsonPath = join(packDirectory, "ysm.json");
    let content = fs.readFileSync(ysmJsonPath, "utf8");
    let ysmJson = loadNormalization(autoParseJSON(content, true));

    // 开始之前计算一次哈希值，用来判断是否已经修改了内容，用于提示保存
    let sha256Cache = getSha256(ysmJson);
    // 添加进缓存
    addToYsmCache(packDirectory);

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
                    dialogInput: importModelMenuDialog,
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
                    <metadataVue v-if="this.type==='metadata'" :import-model-menu-dialog='dialogInput'
                                 :ysm-json='ysmJson' :pack-directory='packDirectory'/>
                    <propertiesVue v-if="this.type==='properties'" :import-model-menu-dialog='dialogInput'
                                   :ysm-json='ysmJson' :pack-directory='packDirectory'/>
                    <playerFilesVue v-if="this.type==='player_files'" :import-model-menu-dialog='dialogInput'
                                    :ysm-json='ysmJson' :pack-directory='packDirectory'/>
                    <arrowFilesVue v-if="this.type==='arrow_files'" :import-model-menu-dialog='dialogInput'
                                   :ysm-json='ysmJson' :pack-directory='packDirectory'/>
                </div>`
        }
    });

    importModelMenuDialog.show();

    if (importModelMenuDialog.object && importModelMenuDialog.object.style) {
        importModelMenuDialog.object.style["max-width"] = "1000px";
        importModelMenuDialog.object.style["min-height"] = "600px";
    }
}
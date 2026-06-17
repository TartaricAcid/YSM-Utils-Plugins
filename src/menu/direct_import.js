import {checkDirectory} from "../import/check_directory.js";
import {readYsmFile} from "../import/ysm_file_read.js";
import importTypeVue from "../vue/import/import_type.vue";
import {PLUGINS_DIALOG} from "../util/native_module.js";

export let directImportMenuAction = new Action("ysm_utils.direct_import", {
    name: "menu.ysm_utils.direct_import.name",
    icon: "fa-file-import",
    click: function () {
        PLUGINS_DIALOG.showOpenDialog(currentwindow, {
            title: tl("menu.ysm_utils.direct_import.name"),
            properties: ["openDirectory"]
        }).then(result => {
            if (result.canceled) {
                return;
            }
            let selectFilePaths = result.filePaths;
            if (selectFilePaths && selectFilePaths[0] && checkDirectory(selectFilePaths[0])) {
                openImportTypeDialog(selectFilePaths[0]);
            }
        });
    }
});

export function openImportTypeDialog(packDirectory) {
    let ysmJson = readYsmFile(packDirectory);

    let importTypeMenuDialog = new Dialog({
        title: "menu.ysm_utils.direct_import.name",
        cancel_on_click_outside: false,
        singleButton: true,
        width: 700,
        component: {
            data() {
                return {
                    dialogInput: importTypeMenuDialog,
                    ysmJson: ysmJson,
                    packDirectory: packDirectory
                };
            },
            components: {
                importTypeVue: importTypeVue
            },
            template: `
                <importTypeVue :import-type-menu-dialog="dialogInput"
                               :ysm-json="ysmJson"
                               :pack-directory="packDirectory"/>`
        }
    });

    importTypeMenuDialog.show();
}

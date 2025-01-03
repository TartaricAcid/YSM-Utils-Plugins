import {checkDirectory} from "../import/check_directory.js";
import {openImportDialog} from "../import/open_import_dialog.js";

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
                openImportDialog(selectFilePaths[0]);
            }
        });
    }
});
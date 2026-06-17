import {openImportDialog} from "../import/open_import_dialog.js";
import {getProjectPathInfo, hasProjectPathInfo} from "../util/project_info_manager.js";
import {PLUGINS_FS} from "../util/native_module.js";

export let currentInfoMenuAction = new Action("ysm_utils.current_info_menu", {
    name: "menu.ysm_utils.current_info_menu.name",
    icon: "fa-circle-info",
    condition: () => hasProjectPathInfo(),
    click: function () {
        let path = getProjectPathInfo();
        if (PLUGINS_FS.existsSync(path)) {
            openImportDialog(path);
        } else {
            Blockbench.showQuickMessage(tl("menu.ysm_utils.current_info_menu.no_info"), 3000);
        }
    }
});

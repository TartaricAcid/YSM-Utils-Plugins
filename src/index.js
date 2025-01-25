import {loadI18n} from "./util/i18n.js";
import packageInfo from "../package.json";
import {CACHE_YSM_INFO_ACTION, initCacheYsmFoldersAction} from "./menu/cache_info_menu.js";
import {currentInfoMenuAction} from "./menu/current_info_menu.js";
import {directImportMenuAction} from "./menu/direct_import.js";
import {createDefaultModel} from "./create/create_default.js";

BBPlugin.register(packageInfo.name, {
    title: packageInfo.title,
    author: packageInfo.author,
    description: packageInfo.description,
    icon: "card_membership",
    variant: "desktop",
    version: packageInfo.version,
    min_version: packageInfo.min_blockbench_version,
    tags: ["Minecraft: Java Edition", "Yes Steve Model", "Mod"],
    await_loading: true,
    onload() {
        doLoadEvent();
    },
    onunload() {
        createDefaultModel.delete();
        directImportMenuAction.delete();
        currentInfoMenuAction.delete();
    },
    oninstall() {
    },
    onuninstall() {
    },
});

function doLoadEvent() {
    loadI18n();
    initCacheYsmFoldersAction();
    new BarMenu("ysm_utils", [
        "ysm_utils.create_default_model",
        "ysm_utils.direct_import",
        "ysm_utils.current_info_menu",
        CACHE_YSM_INFO_ACTION,
    ]);
    MenuBar.update();
}
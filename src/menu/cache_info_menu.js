import {checkDirectory} from "../import/check_directory.js";
import {openImportTypeDialog} from "./direct_import.js";
import {PLUGINS_FS} from "../util/native_module.js";

const CACHE_YSM_FOLDERS = [];

export const CACHE_YSM_INFO_ACTION = {
    name: "menu.ysm_utils.cache_info_menu.name",
    id: "ysm_utils.cache_info_menu",
    icon: "fa-history",
    children: function () {
        let arr = [...CACHE_YSM_FOLDERS].reverse();
        if (arr.length) {
            arr.push("_", {
                name: tl("menu.ysm_utils.cache_info_menu.clear_all"),
                icon: "clear",
                click: function () {
                    localStorage.removeItem("cacheYsmFolders");
                    CACHE_YSM_FOLDERS.length = 0;
                }
            });
        }
        return arr;
    }
};

export function initCacheYsmFoldersAction() {
    let cacheYsmFolders = localStorage.getItem("cacheYsmFolders");
    if (!cacheYsmFolders || !cacheYsmFolders.length) {
        return;
    }
    cacheYsmFolders = JSON.parse(cacheYsmFolders);
    if (cacheYsmFolders) {
        for (let name of Object.keys(cacheYsmFolders)) {
            let path = cacheYsmFolders[name];
            if (PLUGINS_FS.existsSync(path)) {
                addCacheYsmFoldersAction(name, path);
            } else {
                delete cacheYsmFolders[name];
            }
        }
    }
    localStorage.setItem("cacheYsmFolders", JSON.stringify(cacheYsmFolders));
}

export function addToYsmCache(path) {
    let cacheYsmFolders = localStorage.getItem("cacheYsmFolders");
    if (!cacheYsmFolders || !cacheYsmFolders.length) {
        cacheYsmFolders = {};
    } else {
        cacheYsmFolders = JSON.parse(cacheYsmFolders);
    }
    let name = pathToName(path, true);
    if (cacheYsmFolders[name] && cacheYsmFolders[name].length) {
        return;
    }
    cacheYsmFolders[name] = path;
    localStorage.setItem("cacheYsmFolders", JSON.stringify(cacheYsmFolders));
    addCacheYsmFoldersAction(name, path);
}

export function getCacheYsmImportConfig() {
    let cacheYsmImportConfig = localStorage.getItem("cacheYsmImportConfig");
    if (!cacheYsmImportConfig || !cacheYsmImportConfig.length) {
        return {
            "load_animation": true,
            "load_animation_controllers": true
        };
    } else {
        return JSON.parse(cacheYsmImportConfig);
    }
}

export function saveCacheYsmImportConfig(config) {
    localStorage.setItem("cacheYsmImportConfig", JSON.stringify(config));
}

function addCacheYsmFoldersAction(name, desc) {
    CACHE_YSM_FOLDERS.push({
        id: name,
        name: name,
        description: desc,
        icon: "fa-folder",
        click: function () {
            let cacheYsmFolders = localStorage.getItem("cacheYsmFolders");
            if (!cacheYsmFolders || !cacheYsmFolders.length) {
                return;
            }
            cacheYsmFolders = JSON.parse(cacheYsmFolders);
            if (cacheYsmFolders[this.id]) {
                let path = cacheYsmFolders[this.id];
                if (PLUGINS_FS.existsSync(path) && checkDirectory(path)) {
                    openImportTypeDialog(path);
                }
            }
        }
    });
}

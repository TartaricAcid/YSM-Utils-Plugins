import {loadYsmFolderModel} from "./load";

var CACHE_YSM_FOLDERS = [];

export var CACHE_YSM_MODEL_ACTION = {
    name: "打开历史模型",
    id: "ysm_utils.load_cache_pack",
    icon: "fa-history",
    children: function () {
        let arr = [...CACHE_YSM_FOLDERS].reverse();
        if (arr.length) {
            arr.push("_", {
                name: "清除所有",
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
            if (fs.existsSync(path)) {
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
                loadYsmFolderModel(path);
            }
        }
    });
}
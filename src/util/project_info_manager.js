const PROPERTY_ID = "ysm_project_info";

/**
 * 将当前包路径信息添加进 Project 里，方便菜单快捷打开
 */
export function addProjectInfo(packDir) {
    if (Project) {
        Project[PROPERTY_ID] = {
            "path": packDir
        };
        Blockbench.setStatusBarText(tl("menu.ysm_utils.current_info_menu.status_bar_text"));
    }
}

/**
 * 返回当前存进 Project 里的信息，可能为 null
 * @returns {*|null}
 */
export function getProjectPathInfo() {
    if (Project) {
        return Project?.[PROPERTY_ID]?.["path"];
    }
    return null;
}

export function hasProjectPathInfo() {
    // 确保被显式转换为布尔值
    return !!(Project && Project?.[PROPERTY_ID]?.["path"]);
}
function metadataHandle(metadata) {
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
}

function propertiesHandle(properties) {
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
    properties["extra_animation_classify"] ??= [];
    properties["extra_animation_buttons"] ??= [];
    properties["preview_animation"] ??= "idle";
    properties["default_texture"] ??= "";
    properties["free"] ??= false;
    properties["render_layers_first"] ??= false;
    properties["disable_preview_rotation"] ??= false;
    properties["all_cutout"] ??= false;
    properties["gui_no_lighting"] ??= false;
    properties["gui_foreground"] ??= "";
    properties["gui_background"] ??= "";
}

function playerHandle(files) {
    let player = files["player"] ?? {};

    // 模型部分
    let playerModel = player["model"] ??= {};
    playerModel["main"] ??= "";
    playerModel["arm"] ??= "";

    // 动画部分
    let animation = player["animation"] ??= {};
    animation["main"] ??= "";
    animation["arm"] ??= "";
    animation["extra"] ??= "";
    animation["tac"] ??= "";
    animation["carryon"] ??= "";
    animation["swem"] ??= "";
    animation["parcool"] ??= "";
    animation["slashblade"] ??= "";
    animation["tlm"] ??= "";

    // 控制器部分
    player["animation_controllers"] ??= [];

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

    // 声音包路径
    // 2.4.1 及之前的版本该字段在 player 下，2.4.1 之后移到 files 下
    if ("sound_path" in player) {
        files["sound_path"] = player["sound_path"];
        delete player["sound_path"];
    }
}

// 将旧版的 arrow 字段转换为新版
function oldArrowHandle(files) {
    if (!("arrow" in files)) {
        return;
    }
    let projectiles = files["projectiles"];
    projectiles["minecraft:arrow"] = files["arrow"];
    delete files["arrow"];
}

function otherFilesHandle(files) {
    Object.values(files).forEach(file => {
        file["model"] ??= "";
        file["texture"] ??= {};
        file["animation"] ??= "";
        file["controller"] ??= "";

        let texture = file["texture"];
        if (typeof texture == "string") {
            file["texture"] = {
                "uv": texture,
                "normal": "",
                "specular": ""
            };
        } else {
            texture["uv"] ??= "";
            texture["normal"] ??= "";
            texture["specular"] ??= "";
        }
    });
}

/**
 * 规格化 ysm.json 对象，方便后续 Vue 菜单显示
 */
export function loadNormalization(ysmJson) {
    ysmJson["spec"] = 2;

    // metadata 部分
    let metadata = ysmJson["metadata"] ??= {};
    metadataHandle(metadata);

    // properties 部分
    let properties = ysmJson["properties"] ??= {};
    propertiesHandle(properties);

    // files 部分
    let files = ysmJson["files"] ??= {};
    // 投掷物和载具部分
    let projectiles = files["projectiles"] ??= {};
    let vehicles = files["vehicles"] ??= {};
    // 函数、声音包、语言文件部分
    files["sound_path"] ??= "sounds";
    files["function_path"] ??= "functions";
    files["language_path"] ??= "lang";

    // player 部分
    playerHandle(files);
    // arrow 部分
    oldArrowHandle(files);
    // 投掷物和载具部分
    otherFilesHandle(projectiles);
    otherFilesHandle(vehicles);

    return ysmJson;
}
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
    properties["preview_animation"] ??= "idle";
    properties["default_texture"] ??= "";
    properties["free"] ??= false;
    properties["render_layers_first"] ??= false;
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
}

function arrowHandle(files) {
    let arrow = files["arrow"] ??= {
        "model": "",
        "animation": "",
        "texture": ""
    };
    arrow["model"] ??= "";
    arrow["animation"] ??= "";

    let texture = arrow["texture"] ?? {};
    if (typeof texture == "string") {
        arrow["texture"] = {
            "uv": texture,
            "normal": "",
            "specular": ""
        };
    } else {
        texture["uv"] ??= "";
        texture["normal"] ??= "";
        texture["specular"] ??= "";
    }
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
    // player 部分
    playerHandle(files);
    // arrow 部分
    arrowHandle(files);

    return ysmJson;
}
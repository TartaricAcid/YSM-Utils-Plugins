function metadataHandle(metadata, ysmJsonPath) {
    if (isEmptyString(metadata["name"])) {
        metadata["name"] = "<Unknown>";
    }

    if (isEmptyString(metadata["tips"])) {
        metadata["tips"] = "<Unknown>";
    }

    metadata["license"] ??= {
        "type": "All Rights Reserved"
    };
    if (metadata["license"]) {
        let license = metadata["license"];
        if (isEmptyString(license["type"])) {
            license["type"] = "All Rights Reserved";
        }
        deleteField(license, "desc");
        if (isEmptyString(license["desc"])) {
            delete license["desc"];
        }
    }

    metadata["authors"] ??= [];
    metadata["authors"].forEach(author => {
        author["name"] ??= "<Unknown>";
        deleteField(author, "avatar");
        deleteField(author, "role");
        deleteObject(author, "contact");
        deleteField(author, "comment");
    });
    // 作者为空，给一个占位符
    if (metadata["authors"].length <= 0) {
        metadata["authors"] = [{
            "name": "<Unknown>"
        }];
    }
    // 2.5 版本开始，模组自动调整头像大小，无需插件调整了

    metadata["link"] ??= {};
    deleteObject(metadata, "link");
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
    extraAnimationClassifyHandle(properties);
    extraAnimationButtonsHandle(properties);
    properties["preview_animation"] ??= "idle";
    deleteField(properties, "default_texture");
    properties["free"] ??= false;
    properties["render_layers_first"] ??= false;

    deleteField(properties, "gui_foreground");
    deleteField(properties, "gui_background");
    if (properties["gui_foreground"]) {
        properties["gui_foreground"] = properties["gui_foreground"].replaceAll("\\", "/");
    }
    if (properties["gui_background"]) {
        properties["gui_background"] = properties["gui_background"].replaceAll("\\", "/");
    }
}

function extraAnimationClassifyHandle(properties) {
    let extraAnimationClassify = properties["extra_animation_classify"] ??= [];
    let output = [];
    extraAnimationClassify.forEach(value => {
        if (!isEmptyString(value["id"])) {
            output.push(value);
        }
    });
    if (output.length > 0) {
        properties["extra_animation_classify"] = output;
    } else {
        delete properties["extra_animation_classify"];
    }
}

function extraAnimationButtonsHandle(properties) {
    let extraAnimationButtons = properties["extra_animation_buttons"] ??= [];
    let output = [];
    extraAnimationButtons.forEach(value => {
        if (!isEmptyString(value["id"])) {
            value["config_forms"].forEach(forms => {
                delete forms["uuid"];
                delete forms["tmp_labels"];

                // 删除不必要的属性
                if (forms["type"] === "checkbox") {
                    delete forms["step"];
                    delete forms["min"];
                    delete forms["max"];
                    delete forms["labels"];
                }
                if (forms["type"] === "range") {
                    delete forms["labels"];
                }
                if (forms["type"] === "radio") {
                    delete forms["step"];
                    delete forms["min"];
                    delete forms["max"];
                    Object.keys(forms["labels"]).forEach(key => {
                        deleteField(forms["labels"], key);
                    });
                }
            });
            output.push(value);
        }
    });
    if (output.length > 0) {
        properties["extra_animation_buttons"] = output;
    } else {
        delete properties["extra_animation_buttons"];
    }
}

function playerHandle(files) {
    let player = files["player"] ?? {};

    // 模型部分
    let playerModel = player["model"] ??= {};
    playerModel["main"] ??= "";
    playerModel["arm"] ??= "";
    objSeparatorReplace(playerModel);

    // 动画部分
    player["animation"] ??= {};
    objSeparatorReplace(player["animation"]);
    deleteObject(player, "animation");

    // 控制器部分
    player["animation_controllers"] ??= [];
    player["animation_controllers"] = player["animation_controllers"].map(value => {
        if (typeof value == "string" && !isEmptyString(value)) {
            return value.replaceAll("\\", "/");
        }
        return null;
    }).filter(item => item != null);
    if (player["animation_controllers"].length <= 0) {
        delete player["animation_controllers"];
    }

    // 材质部分
    player["texture"] ??= [];
    player["texture"] = player["texture"].map(value => {
        if (typeof value == "string" && !isEmptyString(value)) {
            return {"uv": value};
        } else {
            deleteField(value, "uv");
            deleteField(value, "normal");
            deleteField(value, "specular");
            return value;
        }
    }).filter(item => {
        item = item ?? {};
        return Object.values(item).length > 0;
    });
    textureListSeparatorReplace(player["texture"]);
}

function otherFilesHandle(files) {
    Object.values(files).forEach(file => {
        objSeparatorReplace(file);
        if (file["texture"]) {
            textureSeparatorReplace(file["texture"]);
        }
        if (file && file["texture"]) {
            deleteObject(file, "texture");
        }
    });
    // 删除空字段
    Object.keys(objSeparatorReplace).forEach(key => {
        deleteField(files, key);
    });
}

function pathDefineHandle(files) {
    // 声音包路径，如果是 sounds 这个，就不需要存在了，直接删掉
    if (files["sound_path"] && files["sound_path"] === "sounds") {
        delete files["sound_path"];
    }
    // 函数路径
    if (files["function_path"] && files["function_path"] === "functions") {
        delete files["function_path"];
    }
    // 语言文件路径
    if (files["language_path"] && files["language_path"] === "lang") {
        delete files["language_path"];
    }
}

/**
 * 保存文件时，需要删除一些空白字段
 */
export function saveNormalization(ysmJson, ysmJsonPath) {
    ysmJson["spec"] = 2;

    // metadata 部分
    let metadata = ysmJson["metadata"] ??= {};
    metadataHandle(metadata, ysmJsonPath);

    // properties 部分
    let properties = ysmJson["properties"] ??= {};
    propertiesHandle(properties);

    // files 部分
    let files = ysmJson["files"] ??= {};

    // player 部分
    playerHandle(files);

    // 投掷物和载具部分
    let projectiles = files["projectiles"] ??= {};
    let vehicles = files["vehicles"] ??= {};
    otherFilesHandle(projectiles);
    otherFilesHandle(vehicles);
    deleteObject(files, "projectiles");
    deleteObject(files, "vehicles");

    // 路径定义部分
    pathDefineHandle(files);

    return ysmJson;
}

function textureSeparatorReplace(texture) {
    texture = texture ?? {};
    if (texture["uv"]) {
        texture["uv"] = texture["uv"].replaceAll("\\", "/");
    }
    if (texture["normal"]) {
        texture["normal"] = texture["normal"].replaceAll("\\", "/");
    }
    if (texture["specular"]) {
        texture["specular"] = texture["specular"].replaceAll("\\", "/");
    }
}

function textureListSeparatorReplace(textures) {
    for (let texture of textures) {
        textureSeparatorReplace(texture);
    }
}

function objSeparatorReplace(obj) {
    for (let key in obj) {
        if (typeof obj[key] === "string") {
            obj[key] = obj[key].replaceAll("\\", "/");
        }
    }
}

function deleteObject(obj, fieldName) {
    // 先删空白内容
    Object.keys(obj[fieldName]).forEach(key => {
        deleteField(obj[fieldName], key);
    });
    // 再检查 object 整体是否要删
    if (Object.keys(obj[fieldName]).length <= 0) {
        delete obj[fieldName];
    }
}

function deleteField(obj, fieldName) {
    if (isEmptyString(obj[fieldName])) {
        delete obj[fieldName];
    }
}

function isEmptyString(str) {
    return !str || (typeof str === "string" && str.trim() === "");
}
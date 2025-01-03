function metadataHandle(metadata) {
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
            console.log(license);
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
    properties["preview_animation"] ??= "idle";
    deleteField(properties, "default_texture");
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
    player["animation"] ??= {};
    deleteObject(player, "animation");

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
}

function arrowHandle(files) {
    deleteObject(files, "arrow");
}

/**
 * 保存文件时，需要删除一些空白字段
 */
export function saveNormalization(ysmJson) {
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
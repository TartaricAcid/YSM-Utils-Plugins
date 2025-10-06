import {join} from "path";

export function writeLanguageFile(locale, filePath, translations) {
    // 先判断目录是否存在
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, {recursive: true});
    }
    // 先尝试删除 value 为空的项
    Object.keys(translations).forEach((key) => {
        if (isEmptyString(translations[key])) {
            delete translations[key];
        }
    });
    // 语言文件是否为空，为空则不写入
    if (Object.keys(translations).length === 0) {
        return;
    }
    // 写入文件
    fs.writeFileSync(join(filePath, `${locale}.json`), autoStringify(translations));
}

export function readLanguageFile(locale, filePath, translations) {
    // 先判断目录是否存在
    let langFile = join(filePath, `${locale}.json`);
    if (!fs.existsSync(langFile) || !fs.statSync(langFile).isFile()) {
        return;
    }
    // 读取文件
    let data = autoParseJSON(fs.readFileSync(langFile, {encoding: "utf8"}));
    console.log(data);
    Object.entries(data).forEach(([key, value]) => {
        if (typeof value === "string") {
            translations[key] = value;
        }
    });
    console.log(translations);
}

/**
 * 通过 ysm.json 生成对应的语言文件
 */
export function getLanguageMap(ysmJson) {
    // 记录语音文件参考
    let langMap = {};
    // 记录 buttons 的名称，用于后续替换
    let buttonNames = {};

    // 元数据
    let metadata = ysmJson["metadata"] ?? {};
    langMap["metadata.name"] = metadata["name"] ?? "";
    langMap["metadata.tips"] = metadata["tips"] ?? "";

    // 处理作者信息
    let authors = metadata["authors"] ?? [];
    if (Array.isArray(authors)) {
        authors.forEach((author, index) => {
            let prefix = `metadata.authors.${index}`;
            langMap[`${prefix}.name`] = author["name"] ?? "";
            langMap[`${prefix}.role`] = author["role"] ?? "";
            langMap[`${prefix}.comment`] = author["comment"] ?? "";
        });
    }

    let properties = ysmJson["properties"] ?? {};

    // 轮盘动画
    let extraAnimation = properties["extra_animation"] ?? {};
    if (typeof extraAnimation === "object") {
        Object.keys(extraAnimation).forEach((key) => {
            let prefix = `properties.extra_animation.${key}`;
            langMap[prefix] = extraAnimation[key] ?? "";
            langMap[`${prefix}.desc`] = "";
        });
    }

    // 子轮盘动画
    let extraAnimationClassify = properties["extra_animation_classify"] ?? {};
    let subExtraAnimation = extraAnimationClassify["extra_animation"];
    if (typeof extraAnimationClassify === "object" && typeof subExtraAnimation === "object") {
        Object.keys(subExtraAnimation).forEach((key) => {
            let prefix = `properties.extra_animation.${key}`;
            langMap[prefix] = subExtraAnimation[key] ?? "";
            langMap[`${prefix}.desc`] = "";
        });
    }

    // 配置按钮
    let extraAnimationButtons = properties["extra_animation_buttons"] ?? [];
    if (Array.isArray(extraAnimationButtons)) {
        extraAnimationButtons.forEach((button, index) => handleButton(button, buttonNames, langMap));
    }

    // 替换按钮名称
    Object.entries(buttonNames).forEach(([buttonId, buttonName]) => {
        let targetValue = `#${buttonId}`;
        let matchers = Object.entries(langMap)
            .filter(([key, value]) => value === targetValue)
            .map(([key]) => key);
        matchers.forEach((key) => {
            langMap[key] = buttonName;
        });
    });

    // 玩家材质
    let files = ysmJson["files"] ?? {};
    let player = files["player"] ?? {};
    let texture = player["texture"] ?? [];
    if (Array.isArray(texture)) {
        texture.forEach((element, index) => {
            // 材质有两种类型
            if (typeof element === "string") {
                let textureName = pathToName(element, false);
                langMap[`files.player.texture.${textureName}`] = textureName;
            } else if (typeof element === "object" && typeof element["uv"] === "string") {
                let textureName = pathToName(element["uv"], false);
                langMap[`files.player.texture.${textureName}`] = textureName;
            }
        });
    }

    return langMap;
}

function handleButton(button, buttonNames, langMap) {
    let buttonId = button["id"];
    let configForms = button["config_forms"];
    if (typeof buttonId !== "string" || !Array.isArray(configForms)) {
        return;
    }
    if (typeof button["name"] === "string") {
        buttonNames[buttonId] = button["name"];
    }
    let prefix = `properties.extra_animation_buttons.${buttonId}.config_forms`;
    configForms.forEach((config) => {
        if (typeof config["title"] === "string") {
            langMap[`${prefix}.title`] = config["title"];
        }
        if (typeof config["description"] === "string") {
            langMap[`${prefix}.description`] = config["description"];
        }
        if (typeof config["labels"] === "object") {
            Object.entries(config["labels"]).forEach(([key, value], index) => {
                langMap[`${prefix}.labels.${index}`] = key;
            });
        }
    });
}

function isEmptyString(str) {
    return !str || (typeof str === "string" && str.trim() === "");
}
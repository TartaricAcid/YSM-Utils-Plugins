import {join} from "path";
import {copyFileSync, mkdirSync} from "fs";

function basicFileGeneration(destPackPath, srcPackPath) {
    // 生成文件夹
    let animationsPath = join(destPackPath, "animations");
    let avatarsPath = join(destPackPath, "avatars");
    let modelsPath = join(destPackPath, "models");
    let texturesPath = join(destPackPath, "textures");

    mkdirSync(destPackPath, {recursive: true});
    mkdirSync(animationsPath, {recursive: true});
    mkdirSync(avatarsPath, {recursive: true});
    mkdirSync(modelsPath, {recursive: true});
    mkdirSync(texturesPath, {recursive: true});

    // 复制动画文件
    copyFile(srcPackPath, "main.animation.json", animationsPath);
    copyFile(srcPackPath, "arm.animation.json", animationsPath);
    copyFile(srcPackPath, "extra.animation.json", animationsPath);
    copyFile(srcPackPath, "tac.animation.json", animationsPath);
    copyFile(srcPackPath, "carryon.animation.json", animationsPath);
    copyFile(srcPackPath, "arrow.animation.json", animationsPath);

    // 复制模型文件
    copyFile(srcPackPath, "main.json", modelsPath);
    copyFile(srcPackPath, "arm.json", modelsPath);
    copyFile(srcPackPath, "arrow.json", modelsPath);

    // 复制贴图
    fs.readdirSync(srcPackPath).forEach(file => {
        if (file.endsWith(".png")) {
            copyFile(srcPackPath, file, texturesPath);
        }
    });
}

function transformExtraInfo(data, metadata, ysmExtraInfo, srcPackName) {
    let properties = data["properties"] = {};

    // metadata 部分
    metadata["name"] = ysmExtraInfo["name"] ?? srcPackName;
    if (ysmExtraInfo["tips"]) {
        metadata["tips"] = ysmExtraInfo["tips"];
    }
    if (ysmExtraInfo["license"]) {
        metadata["license"] = {"type": ysmExtraInfo["license"]};
    }
    if (ysmExtraInfo["authors"]) {
        let destAuthors = metadata["authors"] = [];
        ysmExtraInfo["authors"].forEach(srcAuthor => destAuthors.push({"name": srcAuthor}));
    }

    // properties 部分
    if (ysmExtraInfo["extra_animation_names"]) {
        let extraAnimations = properties["extra_animation"] = {};
        let index = 0;
        ysmExtraInfo["extra_animation_names"].forEach(name => {
            extraAnimations[`extra${index}`] = name;
            index++;
        });
    }
    if (ysmExtraInfo["free"]) {
        properties["free"] = ysmExtraInfo["free"];
    }

    // 如果 properties 字段为空，删除
    if (!data["properties"]) {
        delete data["properties"];
    }
}

function writePlayerFilesJson(files, srcPackPath) {
    let player = files["player"] = {};

    // player model
    let model = {};
    if (fs.existsSync(join(srcPackPath, "main.json"))) {
        model["main"] = "models/main.json";
    }
    if (fs.existsSync(join(srcPackPath, "arm.json"))) {
        model["arm"] = "models/arm.json";
    }
    player["model"] = model;

    // player animation
    let animation = {};
    if (fs.existsSync(join(srcPackPath, "main.animation.json"))) {
        animation["main"] = "animations/main.animation.json";
    }
    if (fs.existsSync(join(srcPackPath, "arm.animation.json"))) {
        animation["arm"] = "animations/arm.animation.json";
    }
    if (fs.existsSync(join(srcPackPath, "extra.animation.json"))) {
        animation["extra"] = "animations/extra.animation.json";
    }
    if (fs.existsSync(join(srcPackPath, "tac.animation.json"))) {
        animation["tac"] = "animations/tac.animation.json";
    }
    if (fs.existsSync(join(srcPackPath, "carryon.animation.json"))) {
        animation["carryon"] = "animations/carryon.animation.json";
    }
    player["animation"] = animation;

    // player texture
    let texture = [];
    fs.readdirSync(srcPackPath).forEach(file => {
        if (file.endsWith(".png") && file !== "arrow.png") {
            texture.push(`textures/${file}`);
        }
    });
    player["texture"] = texture;
}

function writeArrowFilesJson(srcPackPath, files) {
    let arrow = {};
    if (fs.existsSync(join(srcPackPath, "arrow.json"))) {
        arrow["match"] = ["#minecraft:arrows"];
        arrow["model"] = "models/arrow.json";
    } else {
        return;
    }
    if (fs.existsSync(join(srcPackPath, "arrow.png"))) {
        arrow["texture"] = "textures/arrow.png";
    }
    if (fs.existsSync(join(srcPackPath, "arrow.animation.png"))) {
        arrow["animation"] = "animations/arrow.animation.json";
    }
    files["projectiles"] ??= [];
    files["projectiles"].push(arrow);
}

function copyFile(srcPath, srcFileName, destPath) {
    let srcFilePath = join(srcPath, srcFileName);
    if (fs.existsSync(srcFilePath)) {
        let destFilePath = join(destPath, srcFileName);
        copyFileSync(srcFilePath, destFilePath);
    }
}

function writeScaleJson(mainFileJson, outputYsmData) {
    let description = mainFileJson["minecraft:geometry"][0]["description"];
    if (description["ysm_height_scale"] && description["ysm_height_scale"] !== 0.7) {
        if (!outputYsmData["properties"]) {
            outputYsmData["properties"] = {};
        }
        outputYsmData["properties"]["height_scale"] = description["ysm_height_scale"];
    }
    if (description["ysm_width_scale"] && description["ysm_width_scale"] !== 0.7) {
        if (!outputYsmData["properties"]) {
            outputYsmData["properties"] = {};
        }
        outputYsmData["properties"]["width_scale"] = description["ysm_width_scale"];
    }
}

export function oldVersionTransform(srcPackPath, destPath, isVersion114) {
    let srcPackName = pathToName(srcPackPath, false);
    let destPackPath = join(destPath, srcPackName);

    // 如果文件夹存在，不进行转换了
    if (fs.existsSync(destPackPath)) {
        Blockbench.showMessageBox({
            icon: "fa-warning",
            title: tl("level.ysm_utils.warning"),
            message: tl("menu.ysm_utils.old_version_transform.directory_exists"),
        });
        return;
    }

    // 生成并复制基本的文件夹
    basicFileGeneration(destPackPath, srcPackPath);

    // 生成 ysm.json
    let mainFile = join(srcPackPath, "main.json");
    let mainFileJson = autoParseJSON(fs.readFileSync(mainFile, {encoding: "utf8"}));

    let ysmExtraInfo;
    // 1.1.4 和 1.1.5 版本获取额外信息不同方式
    if (isVersion114) {
        ysmExtraInfo = mainFileJson["minecraft:geometry"][0]["description"]["ysm_extra_info"];
    } else {
        let infoFile = join(srcPackPath, "info.json");
        ysmExtraInfo = autoParseJSON(fs.readFileSync(infoFile, {encoding: "utf8"}));
    }

    // 填 ysm 的数据
    let outputYsmData = {"spec": 2};
    // metadata 部分
    let metadata = outputYsmData["metadata"] = {};
    if (ysmExtraInfo) {
        transformExtraInfo(outputYsmData, metadata, ysmExtraInfo, srcPackName);
    } else {
        metadata["name"] = srcPackName;
    }
    // ysm_height_scale 和 ysm_width_scale
    writeScaleJson(mainFileJson, outputYsmData);
    // files 部分
    let files = outputYsmData["files"] = {};
    writePlayerFilesJson(files, srcPackPath);
    // arrow 部分
    writeArrowFilesJson(srcPackPath, files);
    // 写 ysm.json 文件
    fs.writeFileSync(join(destPackPath, "ysm.json"), autoStringify(outputYsmData));
    // 提示
    Blockbench.showQuickMessage(tl("menu.ysm_utils.old_version_transform.success") + destPackPath, 3000);
    // 返回生成的文件夹路径
    return destPackPath;
}
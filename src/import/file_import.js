import {join} from "path";
import {addProjectInfo} from "../util/project_info_manager.js";
import {isSupportImage} from "../util/image_handle.js";
import {PLUGINS_FS} from "../util/native_module.js";

const JSON_OPTIONS = {readtype: "text", errorbox: true};
const IMG_OPTIONS = {readtype: "image", errorbox: true};

export function importMainFile(packDir, ysmJson, dialog, config = {}) {
    let files = ysmJson["files"];
    if (!files) {
        showMissingFieldTip("files");
        return;
    }
    let playerFiles = files["player"];
    if (!playerFiles) {
        showMissingFieldTip("player");
        return;
    }

    let mainModel = playerFiles["model"]["main"];
    if (!mainModel || mainModel.length === 0) {
        showMissingFieldTip("model/main");
        return;
    }
    let mainModelPath = join(packDir, mainModel);
    if (!PLUGINS_FS.existsSync(mainModelPath)) {
        showMissingFileTip(mainModelPath);
        return;
    }
    Blockbench.readFile([mainModelPath], JSON_OPTIONS, files => {
        loadModelFile(files[0]);
        importTexture(playerFiles, packDir, dialog, config);
    });
}

export function importArmFile(packDir, ysmJson, dialog, config = {}) {
    let files = ysmJson["files"];
    if (!files) {
        showMissingFieldTip("files");
        return;
    }
    let playerFiles = files["player"];
    if (!playerFiles) {
        showMissingFieldTip("player");
        return;
    }

    let armModel = playerFiles["model"]["arm"];
    if (!armModel || armModel.length === 0) {
        showMissingFieldTip("model/arm");
        return;
    }
    let armModelPath = join(packDir, armModel);
    if (!PLUGINS_FS.existsSync(armModelPath)) {
        showMissingFileTip(armModelPath);
        return;
    }
    Blockbench.readFile([armModelPath], JSON_OPTIONS, files => {
        loadModelFile(files[0]);
        importTexture(playerFiles, packDir, dialog, config);
    });
}

export function importOtherFile(packDir, file, dialog, config = {}) {
    let model = file["model"];
    if (!model || model.length === 0) {
        showMissingFieldTip("model");
        return;
    }
    let modelPath = join(packDir, model);
    if (!PLUGINS_FS.existsSync(modelPath)) {
        showMissingFileTip(modelPath);
        return;
    }
    Blockbench.readFile([modelPath], JSON_OPTIONS, files => {
        loadModelFile(files[0]);
        importTexture(file, packDir, dialog, config);
    });
}

function importTexture(objFiles, packDir, dialog, config = {}) {
    let images = [];
    let texture = objFiles["texture"];
    let loadAnimation = config["load_animation"] ?? false;

    if (typeof texture === "string") {
        pushImgFile(images, texture, packDir);
    } else if (Array.isArray(texture)) {
        texture.forEach(value => {
            if (typeof value === "string") {
                pushImgFile(images, value, packDir);
            } else if (typeof value === "object") {
                pushImgFile(images, value["uv"], packDir);
            }
        });
    } else if (typeof texture === "object") {
        pushImgFile(images, texture["uv"], packDir);
    }

    Blockbench.readFile(images, IMG_OPTIONS, files => {
        files.forEach(file => new Texture().fromFile(file).add());
        if (loadAnimation) {
            importAnimation(objFiles, packDir, dialog, config);
        } else {
            dialog.close();
        }
        addProjectInfo(packDir);
    });
}

function importAnimation(objFiles, packDir, dialog, config = {}) {
    let animations = [];
    let animation = objFiles["animation"];
    let loadController = config["load_animation_controllers"] ?? false;

    if (typeof animation === "string") {
        pushFile(animations, animation, ".json", packDir);
    } else if (typeof animation === "object") {
        Object.values(animation).forEach(value => {
            pushFile(animations, value, ".json", packDir);
        });
    }

    Blockbench.readFile(animations, JSON_OPTIONS, files => {
        files.forEach(file => Animator.loadFile(file));
        // 加载控制器
        if (loadController) {
            importController(objFiles, packDir, dialog);
        } else {
            dialog.close();
        }
    });
}

function importController(objFiles, packDir, dialog) {
    let animationControllersData = objFiles["animation_controllers"] ?? [];
    if (animationControllersData.length <= 0) {
        dialog.close();
    }
    let animationControllers = [];
    animationControllersData.forEach(value => pushFile(animationControllers, value, ".json", packDir));
    if (animationControllers.length <= 0) {
        dialog.close();
    }
    Blockbench.readFile(animationControllers, JSON_OPTIONS, files => {
        files.forEach(file => {
            Animator.loadFile(file);
        });
        dialog.close();
    });
}

function pushFile(files, pathValue, suffix, packDir) {
    if (pathValue && pathValue.endsWith(suffix)) {
        let filePath = join(packDir, pathValue);
        if (PLUGINS_FS.existsSync(filePath)) {
            files.push(filePath);
        }
    }
}

function pushImgFile(files, pathValue, packDir) {
    if (pathValue && isSupportImage(pathValue)) {
        let filePath = join(packDir, pathValue);
        if (PLUGINS_FS.existsSync(filePath)) {
            files.push(filePath);
        }
    }
}

function showMissingFieldTip(field) {
    Blockbench.showQuickMessage(tl("menu.ysm_utils.file_import.missing_field", [field]), 3000);
}

function showMissingFileTip(file) {
    Blockbench.showQuickMessage(tl("menu.ysm_utils.file_import.missing_file", [file]), 3000);
}

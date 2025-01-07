import {join} from "path";
import {addProjectInfo} from "../util/project_info_manager.js";

const JSON_OPTIONS = {readtype: "text", errorbox: true};
const IMG_OPTIONS = {readtype: "image", errorbox: true};

export function importMainFile(packDir, ysmJson, dialog) {
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
    if (!fs.existsSync(mainModelPath)) {
        showMissingFileTip(mainModelPath);
        return;
    }
    Blockbench.readFile([mainModelPath], JSON_OPTIONS, files => {
        loadModelFile(files[0]);
        importTexture(playerFiles, packDir, true, dialog);
    });
}

export function importArmFile(packDir, ysmJson, dialog) {
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
    if (!fs.existsSync(armModelPath)) {
        showMissingFileTip(armModelPath);
        return;
    }
    Blockbench.readFile([armModelPath], JSON_OPTIONS, files => {
        loadModelFile(files[0]);
        importTexture(playerFiles, packDir, false, dialog);
    });
}

export function importArrowFile(packDir, ysmJson, dialog) {
    let files = ysmJson["files"];
    if (!files) {
        showMissingFieldTip("files");
        return;
    }
    let arrowFiles = files["arrow"];
    if (!arrowFiles) {
        showMissingFieldTip("arrow");
        return;
    }

    let arrowModel = arrowFiles["model"];
    if (!arrowModel || arrowModel.length === 0) {
        showMissingFieldTip("arrow/model");
        return;
    }
    let arrowModelPath = join(packDir, arrowModel);
    if (!fs.existsSync(arrowModelPath)) {
        showMissingFileTip(arrowModelPath);
        return;
    }
    Blockbench.readFile([arrowModelPath], JSON_OPTIONS, files => {
        loadModelFile(files[0]);
        importTexture(arrowFiles, packDir, true, dialog);
    });
}

function importTexture(objFiles, packDir, loadAnimation, dialog) {
    let images = [];
    let texture = objFiles["texture"];

    if (typeof texture === "string") {
        pushFile(images, texture, ".png", packDir);
    } else if (Array.isArray(texture)) {
        texture.forEach(value => {
            if (typeof value === "string") {
                pushFile(images, value, ".png", packDir);
            } else if (typeof value === "object") {
                pushFile(images, value["uv"], ".png", packDir);
            }
        });
    }

    Blockbench.readFile(images, IMG_OPTIONS, files => {
        files.forEach(file => new Texture().fromFile(file).add());
        if (loadAnimation) {
            importAnimation(objFiles, packDir, dialog);
        } else {
            dialog.close();
        }
        addProjectInfo(packDir);
    });
}

function importAnimation(objFiles, packDir, dialog) {
    let animations = [];
    let animation = objFiles["animation"];

    if (typeof animation === "string") {
        pushFile(animations, animation, ".json", packDir);
    } else if (typeof animation === "object") {
        Object.values(animation).forEach(value => {
            pushFile(animations, value, ".json", packDir);
        });
    }

    Blockbench.readFile(animations, JSON_OPTIONS, files => {
        files.forEach(file => Animator.loadFile(file));
        dialog.close();
    });
}

function pushFile(files, pathValue, suffix, packDir) {
    if (pathValue && pathValue.endsWith(suffix)) {
        let filePath = join(packDir, pathValue);
        if (fs.existsSync(filePath)) {
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
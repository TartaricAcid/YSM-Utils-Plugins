import {join} from "path";
import {mkdirSync} from "fs";
import armAnimationJson from "../../assets/default/animations/arm.animation.json";
import arrowAnimationJson from "../../assets/default/animations/arrow.animation.json";
import carryonAnimationJson from "../../assets/default/animations/carryon.animation.json";
import extraAnimationJson from "../../assets/default/animations/extra.animation.json";
import mainAnimationJson from "../../assets/default/animations/main.animation.json";
import parcoolAnimationJson from "../../assets/default/animations/parcool.animation.json";
import swemAnimationJson from "../../assets/default/animations/swem.animation.json";
import tacAnimationJson from "../../assets/default/animations/tac.animation.json";
import armModelJson from "../../assets/default/models/arm.json";
import arrowModelJson from "../../assets/default/models/arrow.json";
import mainModelJson from "../../assets/default/models/main.json";
import ysmJson from "../../assets/default/ysm.json";
import arrowTexture from "../../assets/default/textures/arrow.png";
import blueTexture from "../../assets/default/textures/blue.png";
import defaultTexture from "../../assets/default/textures/default.png";
import gslTexture from "../../assets/default/avatar/gsl.png";
import {openImportDialog} from "../import/open_import_dialog.js";

function createAllFiles(selectFilePaths, formResult) {
    let packPath = join(selectFilePaths[0], formResult.packName);
    if (fs.existsSync(packPath)) {
        electron.dialog.showMessageBoxSync({
            type: "warning",
            title: tl("level.ysm_utils.warning"),
            message: tl("menu.ysm_utils.create_default_model.same_folder"),
            buttons: [tl("dialog.cancel")]
        });
        return;
    }

    // 创建文件夹
    let animations = join(packPath, "animations");
    let avatar = join(packPath, "avatar");
    let models = join(packPath, "models");
    let textures = join(packPath, "textures");

    mkdirSync(packPath, {recursive: true});
    mkdirSync(animations, {recursive: true});
    mkdirSync(avatar, {recursive: true});
    mkdirSync(models, {recursive: true});
    mkdirSync(textures, {recursive: true});

    // 复制文件
    fs.writeFileSync(join(animations, "arm.animation.json"), autoStringify(armAnimationJson));
    fs.writeFileSync(join(animations, "arrow.animation.json"), autoStringify(arrowAnimationJson));
    fs.writeFileSync(join(animations, "carryon.animation.json"), autoStringify(carryonAnimationJson));
    fs.writeFileSync(join(animations, "extra.animation.json"), autoStringify(extraAnimationJson));
    fs.writeFileSync(join(animations, "main.animation.json"), autoStringify(mainAnimationJson));
    fs.writeFileSync(join(animations, "parcool.animation.json"), autoStringify(parcoolAnimationJson));
    fs.writeFileSync(join(animations, "swem.animation.json"), autoStringify(swemAnimationJson));
    fs.writeFileSync(join(animations, "tac.animation.json"), autoStringify(tacAnimationJson));

    fs.writeFileSync(join(models, "arm.json"), autoStringify(armModelJson));
    fs.writeFileSync(join(models, "arrow.json"), autoStringify(arrowModelJson));
    fs.writeFileSync(join(models, "main.json"), autoStringify(mainModelJson));

    fs.writeFileSync(join(packPath, "ysm.json"), autoStringify(ysmJson));

    // 复制贴图
    writePng(join(textures, "arrow.png"), arrowTexture);
    writePng(join(textures, "blue.png"), blueTexture);
    writePng(join(textures, "default.png"), defaultTexture);
    writePng(join(avatar, "gsl.png"), gslTexture);

    // 打开导入窗口
    openImportDialog(packPath);
}

function writePng(filePath, fileData) {
    let base64Data = fileData.replace(/^data:image\/png;base64,/, "");
    let bufferData = Buffer.from(base64Data, "base64");
    // 将二进制数据写入文件
    fs.writeFileSync(filePath, bufferData);
}

function openDialog(selectFilePaths) {
    let createDefaultDialog = new Dialog("create_default_model", {
        title: "menu.ysm_utils.create_default_model",
        width: 800,
        form: {
            packName: {
                label: "menu.ysm_utils.create_default_model.pack_name",
                type: "text",
                placeholder: tl("menu.ysm_utils.create_default_model.pack_name.placeholder")
            }
        },
        onConfirm: function (formResult) {
            if (formResult.packName) {
                createAllFiles(selectFilePaths, formResult);
            }
        }
    });
    createDefaultDialog.show();
}

export var createDefaultModel = new Action("ysm_utils.create_default_model", {
    name: tl("menu.ysm_utils.create_default_model"),
    icon: "fa-file-alt",
    click: async function () {
        let result = await electron.dialog.showOpenDialog(currentwindow, {
            title: tl("menu.ysm_utils.create_default_model.select_output_directory"),
            properties: ["openDirectory"]
        });
        if (result.canceled) {
            return;
        }
        let selectFilePaths = result.filePaths;
        if (selectFilePaths && selectFilePaths[0]) {
            openDialog(selectFilePaths);
        }
    }
});
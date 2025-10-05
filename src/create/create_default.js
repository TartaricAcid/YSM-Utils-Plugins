import {join} from "path";
import {mkdirSync} from "fs";
import armAnimationJson from "../../assets/default/animations/arm.animation.json";
import arrowAnimationJson from "../../assets/default/animations/arrow.animation.json";
import boatAnimationJson from "../../assets/default/animations/boat.animation.json";
import carryonAnimationJson from "../../assets/default/animations/carryon.animation.json";
import extraAnimationJson from "../../assets/default/animations/extra.animation.json";
import mainAnimationJson from "../../assets/default/animations/main.animation.json";
import fpArmAnimationJson from "../../assets/default/animations/fp.arm.animation.json";
import parcoolAnimationJson from "../../assets/default/animations/parcool.animation.json";
import swemAnimationJson from "../../assets/default/animations/swem.animation.json";
import tacAnimationJson from "../../assets/default/animations/tac.animation.json";
import slashbladeAnimationJson from "../../assets/default/animations/slashblade.animation.json";
import tlmAnimationJson from "../../assets/default/animations/tlm.animation.json";
import animationControllers from "../../assets/default/controller/main.animation_controllers.json";
import enLanguage from "../../assets/default/lang/en_us.json";
import zhLanguage from "../../assets/default/lang/zh_cn.json";
import armModelJson from "../../assets/default/models/arm.json";
import arrowModelJson from "../../assets/default/models/arrow.json";
import boatModelJson from "../../assets/default/models/boat.json";
import fishingBobberModelJson from "../../assets/default/models/fishing_bobber.json";
import mainModelJson from "../../assets/default/models/main.json";
import minecartJson from "../../assets/default/models/minecart.json";
import ysmJson from "../../assets/default/ysm.json";
import arrowTexture from "../../assets/default/textures/arrow.png";
import boatTexture from "../../assets/default/textures/boat.png";
import fishingBobberTexture from "../../assets/default/textures/fishing_bobber.png";
import minecartTexture from "../../assets/default/textures/minecart.png";
import blueTexture from "../../assets/default/textures/blue.png";
import defaultTexture from "../../assets/default/textures/default.png";
import avatarTexture from "../../assets/default/avatar/null.png";
import backgroundImg from "../../assets/default/textures/gui/background.png";
import foregroundImg from "../../assets/default/textures/gui/foreground.png";
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
    let sounds = join(packPath, "sounds");
    let controller = join(packPath, "controller");
    let functions = join(packPath, "functions");
    let lang = join(packPath, "lang");
    let gui = join(textures, "gui");

    mkdirSync(packPath, {recursive: true});
    mkdirSync(animations, {recursive: true});
    mkdirSync(avatar, {recursive: true});
    mkdirSync(models, {recursive: true});
    mkdirSync(textures, {recursive: true});
    mkdirSync(sounds, {recursive: true});
    mkdirSync(controller, {recursive: true});
    mkdirSync(functions, {recursive: true});
    mkdirSync(lang, {recursive: true});
    mkdirSync(gui, {recursive: true});

    // 复制文件
    fs.writeFileSync(join(animations, "arm.animation.json"), autoStringify(armAnimationJson));
    fs.writeFileSync(join(animations, "arrow.animation.json"), autoStringify(arrowAnimationJson));
    fs.writeFileSync(join(animations, "carryon.animation.json"), autoStringify(carryonAnimationJson));
    fs.writeFileSync(join(animations, "extra.animation.json"), autoStringify(extraAnimationJson));
    fs.writeFileSync(join(animations, "main.animation.json"), autoStringify(mainAnimationJson));
    fs.writeFileSync(join(animations, "parcool.animation.json"), autoStringify(parcoolAnimationJson));
    fs.writeFileSync(join(animations, "swem.animation.json"), autoStringify(swemAnimationJson));
    fs.writeFileSync(join(animations, "tac.animation.json"), autoStringify(tacAnimationJson));
    fs.writeFileSync(join(animations, "slashblade.animation.json"), autoStringify(slashbladeAnimationJson));
    fs.writeFileSync(join(animations, "tlm.animation.json"), autoStringify(tlmAnimationJson));
    fs.writeFileSync(join(animations, "fp.arm.animation.json"), autoStringify(fpArmAnimationJson));
    fs.writeFileSync(join(animations, "boat.animation.json"), autoStringify(boatAnimationJson));

    fs.writeFileSync(join(controller, "main.animation_controllers.json"), autoStringify(animationControllers));

    fs.writeFileSync(join(models, "arm.json"), autoStringify(armModelJson));
    fs.writeFileSync(join(models, "arrow.json"), autoStringify(arrowModelJson));
    fs.writeFileSync(join(models, "main.json"), autoStringify(mainModelJson));
    fs.writeFileSync(join(models, "boat.json"), autoStringify(boatModelJson));
    fs.writeFileSync(join(models, "fishing_bobber.json"), autoStringify(fishingBobberModelJson));
    fs.writeFileSync(join(models, "minecart.json"), autoStringify(minecartJson));

    fs.writeFileSync(join(lang, "en_us.json"), autoStringify(enLanguage));
    fs.writeFileSync(join(lang, "zh_cn.json"), autoStringify(zhLanguage));

    fs.writeFileSync(join(packPath, "ysm.json"), autoStringify(ysmJson));

    // 复制贴图
    writePng(join(textures, "arrow.png"), arrowTexture);
    writePng(join(textures, "boat.png"), boatTexture);
    writePng(join(textures, "fishing_bobber.png"), fishingBobberTexture);
    writePng(join(textures, "minecart.png"), minecartTexture);
    writePng(join(textures, "blue.png"), blueTexture);
    writePng(join(textures, "default.png"), defaultTexture);
    writePng(join(avatar, "null.png"), avatarTexture);
    writePng(join(gui, "background.png"), backgroundImg);
    writePng(join(gui, "foreground.png"), foregroundImg);

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
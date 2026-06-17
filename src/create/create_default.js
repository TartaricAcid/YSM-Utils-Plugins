import {join} from "path";
import {PLUGINS_DIALOG, PLUGINS_FS} from "../util/native_module.js";
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
    if (PLUGINS_FS.existsSync(packPath)) {
        PLUGINS_DIALOG.showMessageBoxSync({
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

    PLUGINS_FS.mkdirSync(packPath, {recursive: true});
    PLUGINS_FS.mkdirSync(animations, {recursive: true});
    PLUGINS_FS.mkdirSync(avatar, {recursive: true});
    PLUGINS_FS.mkdirSync(models, {recursive: true});
    PLUGINS_FS.mkdirSync(textures, {recursive: true});
    PLUGINS_FS.mkdirSync(sounds, {recursive: true});
    PLUGINS_FS.mkdirSync(controller, {recursive: true});
    PLUGINS_FS.mkdirSync(functions, {recursive: true});
    PLUGINS_FS.mkdirSync(lang, {recursive: true});
    PLUGINS_FS.mkdirSync(gui, {recursive: true});

    // 复制文件
    PLUGINS_FS.writeFileSync(join(animations, "arm.animation.json"), autoStringify(armAnimationJson));
    PLUGINS_FS.writeFileSync(join(animations, "arrow.animation.json"), autoStringify(arrowAnimationJson));
    PLUGINS_FS.writeFileSync(join(animations, "carryon.animation.json"), autoStringify(carryonAnimationJson));
    PLUGINS_FS.writeFileSync(join(animations, "extra.animation.json"), autoStringify(extraAnimationJson));
    PLUGINS_FS.writeFileSync(join(animations, "main.animation.json"), autoStringify(mainAnimationJson));
    PLUGINS_FS.writeFileSync(join(animations, "parcool.animation.json"), autoStringify(parcoolAnimationJson));
    PLUGINS_FS.writeFileSync(join(animations, "swem.animation.json"), autoStringify(swemAnimationJson));
    PLUGINS_FS.writeFileSync(join(animations, "tac.animation.json"), autoStringify(tacAnimationJson));
    PLUGINS_FS.writeFileSync(join(animations, "slashblade.animation.json"), autoStringify(slashbladeAnimationJson));
    PLUGINS_FS.writeFileSync(join(animations, "tlm.animation.json"), autoStringify(tlmAnimationJson));
    PLUGINS_FS.writeFileSync(join(animations, "fp.arm.animation.json"), autoStringify(fpArmAnimationJson));
    PLUGINS_FS.writeFileSync(join(animations, "boat.animation.json"), autoStringify(boatAnimationJson));

    PLUGINS_FS.writeFileSync(join(controller, "main.animation_controllers.json"), autoStringify(animationControllers));

    PLUGINS_FS.writeFileSync(join(models, "arm.json"), autoStringify(armModelJson));
    PLUGINS_FS.writeFileSync(join(models, "arrow.json"), autoStringify(arrowModelJson));
    PLUGINS_FS.writeFileSync(join(models, "main.json"), autoStringify(mainModelJson));
    PLUGINS_FS.writeFileSync(join(models, "boat.json"), autoStringify(boatModelJson));
    PLUGINS_FS.writeFileSync(join(models, "fishing_bobber.json"), autoStringify(fishingBobberModelJson));
    PLUGINS_FS.writeFileSync(join(models, "minecart.json"), autoStringify(minecartJson));

    PLUGINS_FS.writeFileSync(join(lang, "en_us.json"), autoStringify(enLanguage));
    PLUGINS_FS.writeFileSync(join(lang, "zh_cn.json"), autoStringify(zhLanguage));

    PLUGINS_FS.writeFileSync(join(packPath, "ysm.json"), autoStringify(ysmJson));

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
    PLUGINS_FS.writeFileSync(filePath, bufferData);
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
        let result = await PLUGINS_DIALOG.showOpenDialog(currentwindow, {
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

<script>
import {join} from "path";
import {changeCurrentFile, removeCurrentFile} from "./file_handler.js";

export default {
    props: {
        importModelMenuDialog: {
            type: Object,
            required: true
        },
        ysmJson: {
            type: Object,
            required: true
        },
        packDirectory: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            animation_type: ["arm", "extra", "tac", "carryon", "swem", "parcool"]
        };
    },
    methods: {
        join,
        tl,
        changeFile: async function (pathValue, defaultDir, extension = "json") {
            return changeCurrentFile(this.packDirectory, pathValue, defaultDir, extension);
        },
        removeFile: function (pathValue, callback) {
            removeCurrentFile(this.packDirectory, pathValue, callback);
        },
        importArmFile: function () {
            let result = this.importModelMenuDialog.onCancel();
            if (!result) {
                return;
            }
            let armModel = this.playerFiles["model"]["arm"];
            if (!armModel || armModel.length === 0) {
                return;
            }
            let armModelPath = join(this.packDirectory, armModel);
            if (!fs.existsSync(armModelPath)) {
                return;
            }
            let jsonOptions = {readtype: "text", errorbox: true};
            Blockbench.readFile([armModelPath], jsonOptions, files => {
                loadModelFile(files[0]);
                this.importTexture(false);
            });
        },
        importMainFile: function () {
            let result = this.importModelMenuDialog.onCancel();
            if (!result) {
                return;
            }
            let mainModel = this.playerFiles["model"]["main"];
            if (!mainModel || mainModel.length === 0) {
                return;
            }
            let mainModelPath = join(this.packDirectory, mainModel);
            if (!fs.existsSync(mainModelPath)) {
                return;
            }
            let jsonOptions = {readtype: "text", errorbox: true};
            Blockbench.readFile([mainModelPath], jsonOptions, files => {
                loadModelFile(files[0]);
                this.importTexture();
            });
        },
        importTexture: function (loadAnimation = true) {
            let images = [];
            for (let texture of this.playerFiles["texture"]) {
                let uv = texture["uv"];
                if (uv.endsWith(".png")) {
                    let uvPath = join(this.packDirectory, uv);
                    if (fs.existsSync(uvPath)) {
                        images.push(uvPath);
                    }
                }
            }
            let imgOptions = {readtype: "image", errorbox: true};
            Blockbench.readFile(images, imgOptions, files => {
                files.forEach(file => new Texture().fromFile(file).add());
                if (loadAnimation) {
                    this.importAnimation();
                } else {
                    this.importModelMenuDialog.close();
                }
            });
        },
        importAnimation: function () {
            let animations = [];
            for (let animation of Object.values(this.playerFiles["animation"])) {
                if (animation.endsWith(".json")) {
                    let animationPath = join(this.packDirectory, animation);
                    if (fs.existsSync(animationPath)) {
                        animations.push(animationPath);
                    }
                }
            }
            let jsonOptions = {readtype: "text", errorbox: true};
            Blockbench.readFile(animations, jsonOptions, files => {
                files.forEach(file => Animator.loadFile(file));
                this.importModelMenuDialog.close();
            });
        },
        addNewTexture: function (textures) {
            textures.push({
                "uv": "",
                "normal": "",
                "specular": ""
            });
        },
        deleteCurrentTexture: function (textures, index) {
            let texture = textures[index];

            let deleteFiles = [];
            // 判断这些文件存不存在
            for (let value of Object.values(texture)) {
                let filePath = join(this.packDirectory, value);
                if (value.length > 0 && fs.existsSync(filePath)) {
                    deleteFiles.push(filePath);
                }
            }

            // 如果全为空，那么直接删就行
            if (deleteFiles.length <= 0) {
                textures.splice(index, 1);
                return;
            }

            let showMessage = tl("menu.ysm_utils.import_model_menu.files.delete_texture.tip");
            deleteFiles.forEach(name => {
                if (name.length > 0) {
                    showMessage = showMessage + `<br> ${name}`;
                }
            });

            Blockbench.showMessageBox({
                icon: "fa-warning",
                title: tl("level.ysm_utils.warning"),
                message: showMessage,
                buttons: [tl("dialog.confirm"), tl("dialog.cancel")],
                confirm: 0,
                cancel: 1
            }, (button) => {
                if (button !== 0) {
                    return;
                }
                for (let file of deleteFiles) {
                    electron.shell.trashItem(file);
                }
                textures.splice(index, 1);
            });
        }
    },
    computed: {
        playerFiles: function () {
            return this.ysmJson["files"]["player"];
        },
        animations: function () {
            return this.playerFiles["animation"];
        }
    }
};
</script>

<template>
    <div class="new-author">
        <button style="width: 49%" @click="importMainFile">
            {{ tl("menu.ysm_utils.import_model_menu.files.import_main") }}
        </button>
        <button style="width: 49%" @click="importArmFile">
            {{ tl("menu.ysm_utils.import_model_menu.files.import_arm") }}
        </button>


        <div class="new-author-item">
            <p class="title">{{ tl("menu.ysm_utils.import_model_menu.files.player.model") }}</p>
            <p class="desc">{{ tl("menu.ysm_utils.import_model_menu.files.player.model.desc") }}</p>

            <div class="li-item">
                <div style="display: flex;">
                    <p class="li-text"> {{ tl("menu.ysm_utils.import_model_menu.files.player.model.main") }}</p>
                    <input class="input" type="text" v-model.trim="playerFiles['model']['main']" readonly>
                    <div style="display: flex;margin-left: 2px">
                        <button class="icon-button"
                                @click="changeFile(playerFiles['model']['main'], 'models').then(result =>playerFiles['model']['main'] = result)">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                    </div>
                </div>

                <div style="display: flex;">
                    <p class="li-text"> {{ tl("menu.ysm_utils.import_model_menu.files.player.model.arm") }}</p>
                    <input class="input" type="text" v-model.trim="playerFiles['model']['arm']" readonly>
                    <div style="display: flex; margin-left: 2px">
                        <button class="icon-button"
                                @click="changeFile(playerFiles['model']['arm'], 'models').then(result =>playerFiles['model']['arm'] = result)">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>


        <div class="new-author-item">
            <p class="title">{{ tl("menu.ysm_utils.import_model_menu.files.player.animation") }}</p>
            <p class="desc">{{ tl("menu.ysm_utils.import_model_menu.files.player.animation.desc") }}</p>

            <div class="li-item">
                <div style="display: flex;">
                    <p class="li-text"> {{ tl("menu.ysm_utils.import_model_menu.files.player.animation.main") }}</p>
                    <input class="input" type="text" v-model.trim="animations['main']" readonly>
                    <div style="display: flex; margin-left: 2px">
                        <button class="icon-button"
                                @click="changeFile(animations['main'], 'animations').then(result =>animations['main'] = result)">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                    </div>
                </div>

                <div style="display: flex;" v-for="name in animation_type">
                    <p class="li-text"> {{ tl(`menu.ysm_utils.import_model_menu.files.player.animation.${name}`) }}</p>
                    <input class="input" type="text" v-model.trim="animations[name]" readonly>
                    <div style="display: flex; margin-left: 2px">
                        <button class="icon-button"
                                @click="changeFile(animations[name], `animations`).then(result =>animations[name] = result)">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button class="icon-button" @click="removeFile(animations[name], ()=>animations[name]='')">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>


        <div class="new-author-item">
            <p class="title">{{ tl("menu.ysm_utils.import_model_menu.files.player.texture") }}</p>
            <p class="desc">{{ tl("menu.ysm_utils.import_model_menu.files.player.texture.desc") }}</p>

            <div v-for="(texture, index) in playerFiles['texture']" class="li-item">
                <div v-if="index>0" class="texture-delete" @click="deleteCurrentTexture(playerFiles['texture'], index)">
                    <i class="fas fa-times"></i>
                </div>

                <div style="display: flex;">
                    <p class="li-text"> {{ tl("menu.ysm_utils.import_model_menu.files.player.texture.uv") }}</p>
                    <input class="input" type="text" v-model.trim="texture['uv']" readonly>
                    <div style="display: flex; margin-left: 2px">
                        <button class="icon-button"
                                @click="changeFile(texture['uv'], 'textures','png').then(result =>texture['uv'] = result)">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                    </div>
                </div>

                <div style="display: flex;">
                    <p class="li-text">{{ tl("menu.ysm_utils.import_model_menu.files.player.texture.normal") }}</p>
                    <input class="input" type="text" v-model.trim="texture['normal']" readonly>
                    <div style="display: flex; margin-left: 2px">
                        <button class="icon-button"
                                @click="changeFile(texture['normal'], 'textures/pbr', 'png').then(result =>texture['normal'] = result)">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button class="icon-button" @click="removeFile(texture['normal'], ()=>texture['normal']='')">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>

                <div style="display: flex;">
                    <p class="li-text">{{ tl("menu.ysm_utils.import_model_menu.files.player.texture.specular") }}</p>
                    <input class="input" type="text" v-model.trim="texture['specular']" readonly>
                    <div style="display: flex; margin-left: 2px">
                        <button class="icon-button"
                                @click="changeFile(texture['specular'], 'textures/pbr','png').then(result =>texture['specular'] = result)">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button class="icon-button"
                                @click="removeFile(texture['specular'], ()=>texture['specular']='')">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div style="margin-top: 5px;">
                <button style="width: 100%" @click="addNewTexture(playerFiles['texture'])">
                    {{ tl("menu.ysm_utils.import_model_menu.files.add_new_texture") }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.new-author {
    width: 100%;
    overflow-y: auto;
    padding: 10px 20px
}

.new-author-item {
    height: 100%;
    width: 100%;
    margin-top: 10px
}

.title {
    margin: 0;
    padding: 0;
    font-size: large
}

.desc {
    margin: 0;
    padding: 0;
    color: #6a6a6d
}

.li-text {
    width: 20%;
    margin-top: 7px;
    font-size: 15px;
    color: #8b8b8d
}

.input {
    width: 65%;
    border-radius: 1px;
    margin-top: 5px;
    padding: 2px 2px 2px 5px;
    height: 30px;
    font-size: 15px;
    background-color: #1c2026;
    border-style: solid;
    border-width: 1px;
    border-color: #181a1f;
}

.li-item {
    margin-top: 5px;
    margin-bottom: 5px;
    padding: 10px;
    border-radius: 2px;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(24, 26, 31, 0.5);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3)
}

.icon-button {
    margin: 2px;
    padding: 0;
    width: 40px;
    min-width: 30px;
    line-height: 0.5;
}

.icon-button > i {
    font-size: large;
    margin-left: 4px;
}

.texture-delete {
    position: relative;
    width: 100%;
    height: 20px;
}

.texture-delete > i {
    position: absolute;
    top: 0;
    right: 0;
    font-size: x-large;
}

.texture-delete > i:hover {
    color: #ef3636;
}
</style>
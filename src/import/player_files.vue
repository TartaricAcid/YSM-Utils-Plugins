<script>
import {join} from "path";
import {arePathsEqual, createDirectories} from "../util/path_util.js";

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
        changeFile: async function (file, folder, extension = "json") {
            let result = await electron.dialog.showOpenDialog(currentwindow, {
                title: tl("menu.ysm_utils.import_model_menu.files.select_files"),
                filters: [{
                    extensions: [extension],
                    name: extension,
                }],
                properties: ["openFile"]
            });

            if (result.filePaths[0]) {
                console.assert(folder !== "");
                // 路径为空，说明原文件不存在，那么给一个默认名
                let srcFilePath;
                if (!file || file.length === 0) {
                    file = join(folder, pathToName(result.filePaths[0], true));
                    srcFilePath = join(this.packDirectory, file);
                    // 看看文件存不存在，不存在我们创一个空的
                    await createDirectories(srcFilePath);
                } else {
                    srcFilePath = join(this.packDirectory, file);
                }
                let destFilePath = result.filePaths[0];
                // 路径相同的，不进行任何操作
                if (arePathsEqual(srcFilePath, destFilePath)) {
                    Blockbench.showQuickMessage(tl("menu.ysm_utils.import_model_menu.files.same_file"), 2000);
                    return file;
                }
                // 将原文件丢到回收站
                if (fs.existsSync(srcFilePath)) {
                    await electron.shell.trashItem(srcFilePath);
                }
                // 复制到指定目录下
                if (fs.existsSync(destFilePath)) {
                    let error = await fs.promises.copyFile(destFilePath, srcFilePath);
                    if (!error) {
                        Blockbench.showQuickMessage(tl("menu.ysm_utils.import_model_menu.files.replace_success"), 2000);
                    }
                }
            }

            return file;
        },
        removeFile: function (file, callback) {
            // 路径为空，不进行任何操作
            if (!file || file.length === 0) {
                return;
            }
            let srcFilePath = join(this.packDirectory, file);
            // 原文件不存在，清空数值即可
            if (!fs.existsSync(srcFilePath)) {
                callback();
                return;
            }
            Blockbench.showMessageBox({
                icon: "fa-warning",
                title: tl("level.ysm_utils.warning"),
                message: tl("menu.ysm_utils.import_model_menu.files.delete_files"),
                buttons: [tl("dialog.confirm"), tl("dialog.cancel")],
                confirm: 0,
                cancel: 1
            }, (button) => {
                if (button === 0) {
                    let srcFilePath = join(this.packDirectory, file);
                    // 将原文件丢到回收站
                    if (fs.existsSync(srcFilePath)) {
                        electron.shell.trashItem(srcFilePath);
                    }
                    callback();
                }
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
        <button style="width: 100%"> {{ tl("menu.ysm_utils.import_model_menu.files.import") }}</button>


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

            <div v-for="texture in playerFiles['texture']" class="li-item">
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
</style>
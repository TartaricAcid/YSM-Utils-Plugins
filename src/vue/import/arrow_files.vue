<script>
import {join} from "path";
import {changeCurrentFile, removeCurrentFile} from "../../import/file_handler.js";

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
        return {};
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
        importMainFile: function () {
            let result = this.importModelMenuDialog.onCancel();
            if (!result) {
                return;
            }
            let mainModel = this.arrowFiles["model"];
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
            if (!this.arrowFiles["texture"].endsWith(".png")) {
                return;
            }
            let uvPath = join(this.packDirectory, this.arrowFiles["texture"]);
            if (!fs.existsSync(uvPath)) {
                return;
            }
            let imgOptions = {readtype: "image", errorbox: true};
            Blockbench.readFile([uvPath], imgOptions, files => {
                files.forEach(file => new Texture().fromFile(file).add());
                if (loadAnimation) {
                    this.importAnimation();
                } else {
                    this.importModelMenuDialog.close();
                }
            });
        },
        importAnimation: function () {
            if (!this.arrowFiles["animation"].endsWith(".json")) {
                this.importModelMenuDialog.close();
                return;
            }
            let animationPath = join(this.packDirectory, this.arrowFiles["animation"]);
            if (!fs.existsSync(animationPath)) {
                this.importModelMenuDialog.close();
                return;
            }
            let jsonOptions = {readtype: "text", errorbox: true};
            Blockbench.readFile([animationPath], jsonOptions, files => {
                files.forEach(file => Animator.loadFile(file));
                this.importModelMenuDialog.close();
            });
        },
    },
    computed: {
        arrowFiles: function () {
            return this.ysmJson["files"]["arrow"];
        }
    }
};
</script>

<template>
    <div class="new-author">
        <button style="width: 100%" @click="importMainFile">
            {{ tl("menu.ysm_utils.import_model_menu.files.import") }}
        </button>

        <div class="new-author-item">
            <p class="title">{{ tl("menu.ysm_utils.import_model_menu.sidebar.arrow_files") }}</p>
            <p class="desc">{{ tl("menu.ysm_utils.import_model_menu.files.arrow.desc") }}</p>

            <div class="li-item">
                <div style="display: flex;">
                    <p class="li-text"> {{ tl("menu.ysm_utils.import_model_menu.files.arrow.model") }}</p>
                    <input class="input" type="text" v-model.trim="arrowFiles['model']" readonly>
                    <div style="display: flex; margin-left: 2px">
                        <button class="icon-button"
                                @click="changeFile(arrowFiles['model'], 'models').then(result =>arrowFiles['model'] = result)">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button class="icon-button"
                                @click="removeFile(arrowFiles['model'], ()=>arrowFiles['model']='')">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>

                <div style="display: flex;">
                    <p class="li-text"> {{ tl("menu.ysm_utils.import_model_menu.files.arrow.texture") }}</p>
                    <input class="input" type="text" v-model.trim="arrowFiles['texture']" readonly>
                    <div style="display: flex; margin-left: 2px">
                        <button class="icon-button"
                                @click="changeFile(arrowFiles['texture'], 'textures', 'png')
                                .then(result =>arrowFiles['texture'] = result)">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button class="icon-button"
                                @click="removeFile(arrowFiles['texture'], ()=>arrowFiles['texture']='')">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>

                <div style="display: flex;">
                    <p class="li-text"> {{ tl("menu.ysm_utils.import_model_menu.files.arrow.animation") }}</p>
                    <input class="input" type="text" v-model.trim="arrowFiles['animation']" readonly>
                    <div style="display: flex; margin-left: 2px">
                        <button class="icon-button"
                                @click="changeFile(arrowFiles['animation'], 'animations').then(result =>arrowFiles['animation'] = result)">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button class="icon-button"
                                @click="removeFile(arrowFiles['animation'], ()=>arrowFiles['animation']='')">
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
    flex: 1;
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
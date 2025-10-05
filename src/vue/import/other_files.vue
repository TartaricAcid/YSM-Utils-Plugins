<script>
import {join} from "path";
import {changeCurrentFile, changeCurrentFileWithFilters, removeCurrentFile} from "../../import/file_handler.js";
import {importOtherFile} from "../../import/file_import.js";
import {SUPPORTED_IMAGE_NAMES, SUPPORTED_IMAGE_TYPES} from "../../util/image_handle.js";

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
        type: {
            type: String,
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
        changeImgFile: async function (pathValue, defaultDir) {
            return changeCurrentFileWithFilters(this.packDirectory, pathValue, defaultDir, [{
                extensions: SUPPORTED_IMAGE_TYPES,
                name: SUPPORTED_IMAGE_NAMES
            }]);
        },
        removeFile: function (pathValue, callback) {
            removeCurrentFile(this.packDirectory, pathValue, callback);
        },
        importModel: function (file) {
            let result = this.importModelMenuDialog.onCancel();
            if (!result) {
                return;
            }
            importOtherFile(this.packDirectory, file, this.importModelMenuDialog, {
                "load_animation": true
            });
        },
        addNewFile: function () {
            let element = this.ysmJson["files"][this.type];
            let parentVue = this;
            let createDefaultDialog = new Dialog("add_new_model", {
                title: "menu.ysm_utils.add_new_model",
                width: 600,
                form: {
                    entityId: {
                        label: "menu.ysm_utils.add_new_model.entity_id",
                        type: "text",
                        placeholder: tl("menu.ysm_utils.add_new_model.entity_id.placeholder")
                    }
                },
                onConfirm: function (formResult) {
                    if (formResult.entityId) {
                        // 判断这个 entityId 是否重复
                        if (element[formResult.entityId]) {
                            Blockbench.showMessageBox({
                                icon: "fa-warning",
                                title: tl("level.ysm_utils.warning"),
                                message: tl("menu.ysm_utils.add_new_model.entity_id.exist"),
                                buttons: [tl("dialog.confirm")],
                                confirm: 0
                            });
                            return false;
                        }

                        element[formResult.entityId] = {
                            "model": "",
                            "texture": {
                                "uv": "",
                                "normal": "",
                                "specular": ""
                            },
                            "animation": "",
                            "controller": ""
                        };

                        parentVue.$forceUpdate();
                    }
                }
            });
            createDefaultDialog.show();
        },
        deleteCurrentFile: function (files, key) {
            let file = files[key];

            let deleteFiles = [];
            // 判断这些文件存不存在
            for (let value of Object.values(file)) {
                if (typeof value === "string") {
                    let filePath = join(this.packDirectory, value);
                    if (value.length > 0 && fs.existsSync(filePath)) {
                        deleteFiles.push(filePath);
                    }
                } else if (typeof value === "object") {
                    for (let subValue of Object.values(value)) {
                        if (typeof subValue === "string") {
                            let filePath = join(this.packDirectory, subValue);
                            if (subValue.length > 0 && fs.existsSync(filePath)) {
                                deleteFiles.push(filePath);
                            }
                        }
                    }
                }
            }

            // 如果全为空，那么直接删就行
            if (deleteFiles.length <= 0) {
                delete files[key];
                this.$forceUpdate();
                return;
            }

            let showMessage = tl("menu.ysm_utils.load_info_menu.files.delete_files.tip");
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
                delete files[key];
                this.$forceUpdate();
            });
        }
    },
    computed: {}
};
</script>

<template>
    <div class="new-author">
        <div v-for="(fileObj, entityId) in ysmJson['files'][type]" class="new-author-item">
            <p class="title">{{ entityId }}</p>

            <div class="li-item">
                <div class="file-delete" @click="deleteCurrentFile(ysmJson['files'][type], entityId)">
                    <i class="fas fa-times"></i>
                </div>

                <div style="display: flex;">
                    <p class="li-text"> {{ tl("menu.ysm_utils.load_info_menu.files.other.model") }}</p>
                    <input class="input" type="text" v-model.trim="fileObj['model']" readonly>
                    <div style="display: flex; margin-left: 2px">
                        <button class="icon-button"
                                @click="changeFile(fileObj['model'], 'models').then(result =>fileObj['model'] = result)">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button class="icon-button"
                                @click="removeFile(fileObj['model'], ()=>fileObj['model']='')">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>

                <div style="display: flex;">
                    <p class="li-text"> {{ tl("menu.ysm_utils.load_info_menu.files.other.texture.uv") }}</p>
                    <input class="input" type="text" v-model.trim="fileObj['texture']['uv']" readonly>
                    <div style="display: flex; margin-left: 2px">
                        <button class="icon-button"
                                @click="changeImgFile(fileObj['texture']['uv'], 'textures')
                                .then(result =>fileObj['texture']['uv'] = result)">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button class="icon-button"
                                @click="removeFile(fileObj['texture']['uv'], ()=>fileObj['texture']['uv']='')">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>

                <div style="display: flex;">
                    <p class="li-text"> {{ tl("menu.ysm_utils.load_info_menu.files.other.texture.normal") }}</p>
                    <input class="input" type="text" v-model.trim="fileObj['texture']['normal']" readonly>
                    <div style="display: flex; margin-left: 2px">
                        <button class="icon-button"
                                @click="changeImgFile(fileObj['texture']['normal'], 'textures')
                                .then(result =>fileObj['texture']['normal'] = result)">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button class="icon-button"
                                @click="removeFile(fileObj['texture']['normal'], ()=>fileObj['texture']['normal']='')">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>

                <div style="display: flex;">
                    <p class="li-text"> {{ tl("menu.ysm_utils.load_info_menu.files.other.texture.specular") }}</p>
                    <input class="input" type="text" v-model.trim="fileObj['texture']['specular']" readonly>
                    <div style="display: flex; margin-left: 2px">
                        <button class="icon-button"
                                @click="changeImgFile(fileObj['texture']['specular'], 'textures')
                                .then(result =>fileObj['texture']['specular'] = result)">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button class="icon-button"
                                @click="removeFile(fileObj['texture']['specular'], ()=>fileObj['texture']['specular']='')">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>

                <div style="display: flex;">
                    <p class="li-text"> {{ tl("menu.ysm_utils.load_info_menu.files.other.animation") }}</p>
                    <input class="input" type="text" v-model.trim="fileObj['animation']" readonly>
                    <div style="display: flex; margin-left: 2px">
                        <button class="icon-button"
                                @click="changeFile(fileObj['animation'], 'animations').then(result =>fileObj['animation'] = result)">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button class="icon-button"
                                @click="removeFile(fileObj['animation'], ()=>fileObj['animation']='')">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>

                <div style="display: flex;">
                    <p class="li-text"> {{ tl("menu.ysm_utils.load_info_menu.files.other.controller") }}</p>
                    <input class="input" type="text" v-model.trim="fileObj['controller']" readonly>
                    <div style="display: flex; margin-left: 2px">
                        <button class="icon-button"
                                @click="changeFile(fileObj['controller'], 'controller').then(result =>fileObj['controller'] = result)">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button class="icon-button"
                                @click="removeFile(fileObj['controller'], ()=>fileObj['controller']='')">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>

                <button style="width: 100%; margin-top: 10px" @click="importModel(fileObj)">
                    {{ tl("menu.ysm_utils.load_info_menu.files.import") }}
                </button>
            </div>
        </div>

        <button style="width: 100%; margin-top: 20px" @click="addNewFile()">
            {{ tl("menu.ysm_utils.add_new_model") }}
        </button>
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
    font-size: x-large;
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

.file-delete {
    position: relative;
    margin-bottom: 20px;
    width: 100%;
    height: 20px;
}

.file-delete > i {
    position: absolute;
    top: 0;
    right: 0;
    font-size: x-large;
}

.file-delete > i:hover {
    color: #ef3636;
}
</style>
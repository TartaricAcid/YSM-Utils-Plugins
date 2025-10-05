<script>
import {join} from "path";
import {editExtraAnimationDialog} from "../../import/edit_extra_animation.js";
import {editExtraAnimationClassifyDialog} from "../../import/edit_extra_animation_classify.js";
import {editExtraAnimationButtonsDialog} from "../../import/edit_extra_animation_buttons.js";
import {changeCurrentFile, changeCurrentFileWithFilters, removeCurrentFile} from "../../import/file_handler.js";
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
        shouldAddLine: function (index, listSize) {
            // 第一行除去
            if (index === 0) {
                return false;
            }
            // 倒数第二个除去
            if (index === (listSize - 2)) {
                return;
            }
            // 八个为一组，添加横线
            return index % 8 === 6;
        },
        deleteExtraAnimation: function (index) {
            this.tmpExtraAnimation.splice(index, 1);
            this.updateExtraAnimation();
            this.$forceUpdate();
        },
        addNewExtraAnimation: function () {
            this.tmpExtraAnimation.push(["", ""]);
            this.$forceUpdate();
        },
        updateExtraAnimation: function () {
            let tmp = {};
            for (let value of this.tmpExtraAnimation) {
                tmp[value[0]] = value[1];
            }
            this.properties["extra_animation"] = tmp;
        },
        editExtraAnimation: function (index) {
            this.updateExtraAnimation();
            editExtraAnimationDialog(this.ysmJson, this.packDirectory, index);
        },
        deleteExtraAnimationClassify: function (index) {
            this.properties["extra_animation_classify"].splice(index, 1);
            this.$forceUpdate();
        },
        addNewExtraAnimationClassify: function () {
            this.properties["extra_animation_classify"].push({"id": "", "extra_animation": {}});
            this.$forceUpdate();
        },
        editExtraAnimationClassify: function (index) {
            editExtraAnimationClassifyDialog(this.ysmJson, this.packDirectory, index);
        },
        deleteExtraAnimationButtons: function (index) {
            this.properties["extra_animation_buttons"].splice(index, 1);
            this.$forceUpdate();
        },
        addNewExtraAnimationButtons: function () {
            this.properties["extra_animation_buttons"].push({"id": "", "name": "", "config_forms": []});
            this.$forceUpdate();
        },
        editExtraAnimationButtons: function (index) {
            editExtraAnimationButtonsDialog(this.ysmJson, this.packDirectory, index);
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
    },
    computed: {
        properties: function () {
            return this.ysmJson["properties"];
        },
        tmpExtraAnimation: function () {
            let output = [];
            for (let key in this.properties["extra_animation"]) {
                output.push([key, this.properties["extra_animation"][key]]);
            }
            return output;
        },
        allAnimations: function () {
            let keys = new Set();
            let allAnimationList = this.ysmJson?.["files"]["player"]["animation"] ?? {};
            for (let key in allAnimationList) {
                let filePath = join(this.packDirectory, allAnimationList[key]);
                if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                    let content = fs.readFileSync(join(this.packDirectory, allAnimationList[key]), "utf8");
                    let animations = autoParseJSON(content)["animations"] ?? {};
                    Object.keys(animations).forEach(name => keys.add(name));
                }
            }
            return keys;
        },
        allTexture: function () {
            let keys = new Set();
            let textureElement = this.ysmJson?.["files"]["player"]["texture"];
            for (let element of textureElement) {
                if (typeof element === "string") {
                    keys.add(pathToName(element, false));
                } else if (typeof element === "object" && element["uv"]) {
                    keys.add(pathToName(element["uv"], false));
                }
            }
            return keys;
        }
    }
};
</script>

<template>
    <div class="properties">
        <div class="horizontal-item">
            <div style="width: 50%">
                <p class="title">{{ tl("menu.ysm_utils.load_info_menu.properties.height_scale") }}</p>
                <p class="desc">{{ tl("menu.ysm_utils.load_info_menu.properties.height_scale.desc") }}</p>
            </div>

            <div style="width: 50%; margin: 0 auto;">
                <p style="font-size: large">{{ ysmJson["properties"]["height_scale"] }}</p>
                <input class="range" type="range" max="2" min="0.05" step="0.05"
                       v-model.number="properties['height_scale']">
            </div>
        </div>


        <div class="horizontal-item">
            <div style="width: 50%">
                <p class="title">{{ tl("menu.ysm_utils.load_info_menu.properties.width_scale") }}</p>
                <p class="desc">{{ tl("menu.ysm_utils.load_info_menu.properties.width_scale.desc") }}</p>
            </div>

            <div style="width: 50%; margin: 0 auto;">
                <p style="font-size: large">{{ ysmJson["properties"]["width_scale"] }}</p>
                <input class="range" type="range" max="2" min="0.05" step="0.05"
                       v-model.number="properties['width_scale']">
            </div>
        </div>


        <div class="properties-item">
            <p class="title">{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation") }}</p>
            <p class="desc">{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation.desc") }}</p>

            <div style="display: flex; flex-wrap: wrap; margin-top: 10px">
                <div v-for="(value, index) in tmpExtraAnimation"
                     style="width: 49%; margin-left: 2px; margin-top: 2px; overflow: visible;">
                    <input class="input" type="text" style="width: 30%; margin-left: 2px;"
                           v-model.trim="value[0]" disabled>
                    <input class="input" type="text" style="width: 40%; margin-left: 2px;"
                           v-model.trim="value[1]" disabled>
                    <i class="fa-solid fa-pen-to-square extra-delete" @click="editExtraAnimation(index)"></i>
                    <i class="fa-solid fa-trash-can extra-delete" @click="deleteExtraAnimation(index)"></i>

                    <!-- 每 8 个添加一个分隔线 -->
                    <hr v-if="shouldAddLine(index, tmpExtraAnimation.length)"
                        style="width: 192.5%; border-top: 3px dashed #1e1e22;">
                </div>

                <button style="width: 44.8%; margin-left: 2px; margin-top: 2px;"
                        @click="addNewExtraAnimation()">
                    <i class="fa-solid fa-plus" style="vertical-align: middle;"></i>
                    <span>{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation.add") }}</span>
                </button>
            </div>
        </div>

        <div class="properties-item">
            <p class="title">{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation_classify") }}</p>
            <p class="desc">{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation_classify.desc") }}</p>

            <div style="display: flex; flex-wrap: wrap; margin-top: 10px">
                <div v-for="(value, index) in properties['extra_animation_classify']"
                     style="width: 49%; margin-left: 2px; margin-top: 2px; overflow: visible;">
                    <input class="input" type="text" style="width: 72%; margin-left: 2px;"
                           v-model="value['id']" disabled>
                    <i class="fa-solid fa-pen-to-square extra-delete" @click="editExtraAnimationClassify(index)"></i>
                    <i class="fa-solid fa-trash-can extra-delete" @click="deleteExtraAnimationClassify(index)"></i>
                </div>
                <button style="width: 44.8%; margin-left: 2px; margin-top: 2px;"
                        @click="addNewExtraAnimationClassify">
                    <i class="fa-solid fa-plus" style="vertical-align: middle;"></i>
                    <span>{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation.add") }}</span>
                </button>
            </div>
        </div>

        <div class="properties-item">
            <p class="title">{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons") }}</p>
            <p class="desc">{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.desc") }}</p>

            <div style="display: flex; flex-wrap: wrap; margin-top: 10px">
                <div v-for="(value, index) in properties['extra_animation_buttons']"
                     style="width: 49%; margin-left: 2px; margin-top: 2px; overflow: visible;">
                    <input class="input" type="text" style="width: 72%; margin-left: 2px;"
                           v-model="value['id']" disabled>
                    <i class="fa-solid fa-pen-to-square extra-delete" @click="editExtraAnimationButtons(index)"></i>
                    <i class="fa-solid fa-trash-can extra-delete" @click="deleteExtraAnimationButtons(index)"></i>
                </div>
                <button style="width: 44.8%; margin-left: 2px; margin-top: 2px;"
                        @click="addNewExtraAnimationButtons">
                    <i class="fa-solid fa-plus" style="vertical-align: middle;"></i>
                    <span>{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation.add") }}</span>
                </button>
            </div>
        </div>


        <div class="horizontal-item">
            <div style="width: 68%">
                <p class="title">{{ tl("menu.ysm_utils.load_info_menu.properties.preview_animation") }}</p>
                <p class="desc">{{ tl("menu.ysm_utils.load_info_menu.properties.preview_animation.desc") }}</p>
            </div>

            <div style="width: 20%; margin: 0 auto;">
                <select v-model="ysmJson['properties']['preview_animation']" style="width: 100%; text-align: center;">
                    <option selected>{{ ysmJson["properties"]["preview_animation"] }}</option>
                    <option v-for="name in allAnimations">{{ name }}</option>
                </select>
            </div>
        </div>


        <div class="horizontal-item">
            <div style="width: 68%">
                <p class="title">{{ tl("menu.ysm_utils.load_info_menu.properties.default_texture") }}</p>
                <p class="desc">{{ tl("menu.ysm_utils.load_info_menu.properties.default_texture.desc") }}</p>
            </div>

            <div style="width: 20%; margin: 0 auto;">
                <select v-model="ysmJson['properties']['default_texture']" style="width: 100%; text-align: center;">
                    <option selected>{{ ysmJson["properties"]["default_texture"] }}</option>
                    <option v-for="name in allTexture">{{ name }}</option>
                </select>
            </div>
        </div>

        <div class="properties-item">
            <p class="title">{{ tl("menu.ysm_utils.load_info_menu.properties.gui_foreground") }}</p>
            <p class="desc">{{ tl("menu.ysm_utils.load_info_menu.properties.gui_foreground.desc") }}</p>

            <div style="display: flex; margin-top: 10px">
                <input class="input" type="text" v-model.trim="properties['gui_foreground']" readonly>
                <div style="display: flex; margin-left: 2px">
                    <button class="icon-button"
                            @click="changeImgFile(properties['gui_foreground'], 'textures/gui').then(result =>properties['gui_foreground'] = result)">
                        <i class="fas fa-exchange-alt"></i>
                    </button>
                    <button class="icon-button"
                            @click="removeFile(properties['gui_foreground'], ()=>properties['gui_foreground']='')">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        </div>

        <div class="properties-item">
            <p class="title">{{ tl("menu.ysm_utils.load_info_menu.properties.gui_background") }}</p>
            <p class="desc">{{ tl("menu.ysm_utils.load_info_menu.properties.gui_background.desc") }}</p>

            <div style="display: flex; margin-top: 10px">
                <input class="input" type="text" v-model.trim="properties['gui_background']" readonly>
                <div style="display: flex; margin-left: 2px">
                    <button class="icon-button"
                            @click="changeImgFile(properties['gui_background'], 'textures/gui').then(result =>properties['gui_background'] = result)">
                        <i class="fas fa-exchange-alt"></i>
                    </button>
                    <button class="icon-button"
                            @click="removeFile(properties['gui_background'], ()=>properties['gui_background']='')">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        </div>


        <div class="horizontal-item">
            <div style="width: 68%">
                <p class="title">{{ tl("menu.ysm_utils.load_info_menu.properties.free") }}</p>
                <p class="desc">{{ tl("menu.ysm_utils.load_info_menu.properties.free.desc") }}</p>
            </div>

            <div style="width: 20%; margin: 0 auto;">
                <input type="checkbox" v-model="properties['free']" style="width: 100%;">
            </div>
        </div>


        <div class="horizontal-item">
            <div style="width: 68%">
                <p class="title">{{ tl("menu.ysm_utils.load_info_menu.properties.render_layers_first") }}</p>
                <p class="desc">{{ tl("menu.ysm_utils.load_info_menu.properties.render_layers_first.desc") }}</p>
            </div>

            <div style="width: 20%; margin: 0 auto;">
                <input type="checkbox" v-model="properties['render_layers_first']" style="width: 100%;">
            </div>
        </div>

        <div class="horizontal-item">
            <div style="width: 68%">
                <p class="title">{{ tl("menu.ysm_utils.load_info_menu.properties.disable_preview_rotation") }}</p>
                <p class="desc">{{ tl("menu.ysm_utils.load_info_menu.properties.disable_preview_rotation.desc") }}</p>
            </div>

            <div style="width: 20%; margin: 0 auto;">
                <input type="checkbox" v-model="properties['disable_preview_rotation']" style="width: 100%;">
            </div>
        </div>

        <div class="horizontal-item">
            <div style="width: 68%">
                <p class="title">{{ tl("menu.ysm_utils.load_info_menu.properties.all_cutout") }}</p>
                <p class="desc">{{ tl("menu.ysm_utils.load_info_menu.properties.all_cutout.desc") }}</p>
            </div>

            <div style="width: 20%; margin: 0 auto;">
                <input type="checkbox" v-model="properties['all_cutout']" style="width: 100%;">
            </div>
        </div>
    </div>
</template>

<style scoped>
.properties {
    width: 100%;
    overflow-y: auto;
    padding: 10px 20px
}

.properties-item {
    height: 100%;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 20px
}

.horizontal-item {
    height: 100%;
    width: 100%;
    margin-top: 10px;
    display: flex;
    align-items: center;
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

.range {
    width: 100%;
}

.input {
    border-radius: 1px;
    padding: 2px 2px 2px 5px;
    width: 100%;
    background-color: #1c2026;
    border-style: solid;
    border-width: 1px;
    border-color: #181a1f;
}

.extra-delete {
    width: 20px;
    margin-left: 2px
}

.extra-delete:hover {
    color: #2d5ee8;
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
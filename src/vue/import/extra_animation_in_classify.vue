<script>
import {join} from "path";

export default {
    props: {
        editExtraAnimationDialog: {
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
        },
        index: {
            type: Number,
            required: true
        },
        indexInClassify: {
            type: Number,
            required: true
        }
    },
    beforeMount() {
        if (this.isExtraAnimationClassify) {
            this.switchToExtraAnimationClassify();
        }
        if (this.hasConfig) {
            this.switchToHasConfig();
        }
    },
    data() {
        return {
            // 还有 extra_animation_classify 类型
            keyType: "extra_animation",
            // 还有 has_config
            valueType: "no_config"
        };
    },
    methods: {
        join,
        tl,
        switchToExtraAnimation: function () {
            this.keyType = "extra_animation";
        },
        switchToExtraAnimationClassify: function () {
            this.keyType = "extra_animation_classify";
        },
        switchToNoConfig: function () {
            this.valueType = "no_config";
        },
        switchToHasConfig: function () {
            this.valueType = "has_config";
        },
        getAvailableExtraAnimation: function () {
            let output = new Set();
            let existExtraAnimations = Object.keys(this.extraAnimations ?? {});
            this.allExtraAnimations.forEach(name => {
                if (!existExtraAnimations.includes(name)) {
                    output.add(name);
                }
            });
            return output;
        },
        getAvailableExtraAnimationClassify: function () {
            let output = new Set();
            let extraAnimationClassify = this.properties["extra_animation_classify"] ?? [];
            extraAnimationClassify.forEach(value => {
                if (value["id"]) {
                    output.add("#" + value["id"]);
                }
            });
            return output;
        },
        getAvailableConfig: function () {
            let output = new Set();
            let extraAnimationButtons = this.properties["extra_animation_buttons"] ?? [];
            extraAnimationButtons.forEach(value => {
                if (value["id"]) {
                    output.add("#" + value["id"]);
                }
            });
            return output;
        },
        onSaveExtraAnimations: function () {
            let tmp = {};
            for (let value of this.tmpExtraAnimation) {
                tmp[value[0]] = value[1];
            }
            this.properties["extra_animation_classify"][this.indexInClassify]["extra_animation"] = tmp;
            this.editExtraAnimationDialog.close();
        }
    },
    computed: {
        properties: function () {
            return this.ysmJson["properties"];
        },
        extraAnimations: function () {
            return this.properties["extra_animation_classify"][this.indexInClassify]["extra_animation"];
        },
        tmpExtraAnimation: function () {
            let output = [];
            for (let key in this.extraAnimations) {
                output.push([key, this.extraAnimations[key]]);
            }
            return output;
        },
        isExtraAnimationClassify: function () {
            return this.tmpExtraAnimation[this.index][0].startsWith("#");
        },
        hasConfig: function () {
            return this.tmpExtraAnimation[this.index][1].startsWith("#");
        },
        allExtraAnimations: function () {
            let keys = new Set();
            for (let i = 0; i < 8; i++) {
                keys.add(`extra${i}`);
            }
            let extraAnimationFile = this.ysmJson?.["files"]["player"]["animation"]["extra"];
            if (extraAnimationFile) {
                let filePath = join(this.packDirectory, extraAnimationFile);
                if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                    let content = fs.readFileSync(filePath, "utf8");
                    let animations = autoParseJSON(content)["animations"] ?? {};
                    Object.keys(animations).forEach(name => keys.add(name));
                }
            }
            return keys;
        }
    }
};
</script>

<template>
    <div class="properties">
        <div class="all-item">
            <div class="properties-item">
                <p class="title">{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation.key") }}</p>
                <p class="desc">{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation.key.desc") }}</p>

                <div class="horizontal-item" style="margin-bottom: 5px">
                    <div style="width: 50%">
                        <input type="radio" name="extra_animation_type" @click="switchToExtraAnimation"
                               :checked="!isExtraAnimationClassify"/>
                        <label>{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation") }}</label>
                    </div>
                    <div style="width: 50%">
                        <input type="radio" name="extra_animation_type" @click="switchToExtraAnimationClassify"
                               :checked="isExtraAnimationClassify"/>
                        <label>{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation_classify") }}</label>
                    </div>
                </div>

                <div v-if="keyType==='extra_animation'">
                    <select style="width: 100%; text-align: center;margin-top: 5px;"
                            v-model="tmpExtraAnimation[index][0]">
                        <option selected>{{ tmpExtraAnimation[index][0] }}</option>
                        <option v-for="name in getAvailableExtraAnimation()">{{ name }}</option>
                    </select>
                </div>

                <div v-if="keyType==='extra_animation_classify'">
                    <select style="width: 100%; text-align: center; margin-top: 5px;"
                            v-model="tmpExtraAnimation[index][0]">
                        <option selected>{{ tmpExtraAnimation[index][0] }}</option>
                        <option v-for="value in getAvailableExtraAnimationClassify()">{{ value }}</option>
                    </select>
                </div>
            </div>

            <div class="properties-item">
                <p class="title">{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation.value") }}</p>
                <p class="desc">{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation.value.desc") }}</p>

                <div class="horizontal-item" style="margin-bottom: 5px">
                    <div style="width: 50%">
                        <input type="radio" name="extra_animation_config" @click="switchToNoConfig"
                               :checked="!hasConfig"/>
                        <label>{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation.no_config") }}</label>
                    </div>
                    <div style="width: 50%">
                        <input type="radio" name="extra_animation_config" @click="switchToHasConfig"
                               :checked="hasConfig"/>
                        <label>{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation.has_config") }}</label>
                    </div>
                </div>

                <div v-if="valueType==='no_config'">
                    <input class="input" type="text" v-model.trim="tmpExtraAnimation[index][1]"/>
                </div>

                <div v-if="valueType==='has_config'">
                    <select style="width: 100%; text-align: center;margin-top: 5px;"
                            v-model="tmpExtraAnimation[index][1]">
                        <option selected>{{ tmpExtraAnimation[index][1] }}</option>
                        <option v-for="value in getAvailableConfig()">{{ value }}</option>
                    </select>
                </div>
            </div>
        </div>

        <div style="margin-top: 20px; margin-bottom: 10px">
            <button style="width: 100%" @click="onSaveExtraAnimations">{{ tl("dialog.confirm") }}</button>
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

.all-item {
    padding: 20px 30px 20px 30px;
    border-radius: 2px;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(24, 26, 31, 0.5);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3)
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

.input {
    border-radius: 1px;
    margin-top: 5px;
    padding: 2px 2px 2px 5px;
    width: 100%;
    height: 30px;
    font-size: 15px;
    background-color: #1c2026;
    border-style: solid;
    border-width: 1px;
    border-color: #181a1f;
}
</style>
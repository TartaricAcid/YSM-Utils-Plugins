<script>
import {join} from "path";

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
        addNewExtraAnimation: function () {
            this.tmpExtraAnimation.push(["", ""]);
            this.$forceUpdate();
        },
        getAvailableExtraAnimation: function () {
            let output = new Set();
            let existExtraAnimations = Object.keys(this.properties["extra_animation"] ?? {});
            this.allExtraAnimations.forEach(name => {
                if (!existExtraAnimations.includes(name)) {
                    output.add(name);
                }
            });
            return output;
        },
        updateExtraAnimation: function () {
            let tmp = {};
            for (let value of this.tmpExtraAnimation) {
                tmp[value[0]] = value[1];
            }
            this.properties["extra_animation"] = tmp;
        }
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
                <p class="title">{{ tl("menu.ysm_utils.import_model_menu.properties.height_scale") }}</p>
                <p class="desc">{{ tl("menu.ysm_utils.import_model_menu.properties.height_scale.desc") }}</p>
            </div>

            <div style="width: 50%; margin: 0 auto;">
                <p style="font-size: large">{{ ysmJson["properties"]["height_scale"] }}</p>
                <input class="range" type="range" max="2" min="0.05" step="0.05"
                       v-model.number="properties['height_scale']">
            </div>
        </div>


        <div class="horizontal-item">
            <div style="width: 50%">
                <p class="title">{{ tl("menu.ysm_utils.import_model_menu.properties.width_scale") }}</p>
                <p class="desc">{{ tl("menu.ysm_utils.import_model_menu.properties.width_scale.desc") }}</p>
            </div>

            <div style="width: 50%; margin: 0 auto;">
                <p style="font-size: large">{{ ysmJson["properties"]["width_scale"] }}</p>
                <input class="range" type="range" max="2" min="0.05" step="0.05"
                       v-model.number="properties['width_scale']">
            </div>
        </div>


        <div class="properties-item">
            <p class="title">{{ tl("menu.ysm_utils.import_model_menu.properties.extra_animation") }}</p>
            <p class="desc">{{ tl("menu.ysm_utils.import_model_menu.properties.extra_animation.desc") }}</p>

            <div style="display: flex; flex-wrap: wrap; margin-top: 10px">
                <div v-for="(value, index) in tmpExtraAnimation"
                     style="width: 49%; margin-left: 2px; margin-top: 2px">
                    <select id="simple" name="simple" style="width: 40%; text-align: center;"
                            v-model="value[0]" @change="updateExtraAnimation">
                        <option selected>{{ value[0] }}</option>
                        <option v-for="name in getAvailableExtraAnimation()">{{ name }}</option>
                    </select>
                    <input class="input" type="text" style="width: 50%; margin-left: 2px;"
                           v-model.trim="value[1]" @input="updateExtraAnimation">
                </div>

                <button style="width: 44.8%; margin-left: 2px; margin-top: 2px;"
                        @click="addNewExtraAnimation()">
                    <i class="fa-solid fa-plus" style="vertical-align: middle;"></i>
                    <span>{{ tl("menu.ysm_utils.import_model_menu.properties.extra_animation.add") }}</span>
                </button>
            </div>
        </div>


        <div class="horizontal-item">
            <div style="width: 68%">
                <p class="title">{{ tl("menu.ysm_utils.import_model_menu.properties.preview_animation") }}</p>
                <p class="desc">{{ tl("menu.ysm_utils.import_model_menu.properties.preview_animation.desc") }}</p>
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
                <p class="title">{{ tl("menu.ysm_utils.import_model_menu.properties.default_texture") }}</p>
                <p class="desc">{{ tl("menu.ysm_utils.import_model_menu.properties.default_texture.desc") }}</p>
            </div>

            <div style="width: 20%; margin: 0 auto;">
                <select v-model="ysmJson['properties']['default_texture']" style="width: 100%; text-align: center;">
                    <option selected>{{ ysmJson["properties"]["default_texture"] }}</option>
                    <option v-for="name in allTexture">{{ name }}</option>
                </select>
            </div>
        </div>


        <div class="horizontal-item">
            <div style="width: 68%">
                <p class="title">{{ tl("menu.ysm_utils.import_model_menu.properties.free") }}</p>
                <p class="desc">{{ tl("menu.ysm_utils.import_model_menu.properties.free.desc") }}</p>
            </div>

            <div style="width: 20%; margin: 0 auto;">
                <input type="checkbox" v-model="properties['free']" style="width: 100%;">
            </div>
        </div>


        <div class="horizontal-item">
            <div style="width: 68%">
                <p class="title">{{ tl("menu.ysm_utils.import_model_menu.properties.render_layers_first") }}</p>
                <p class="desc">{{ tl("menu.ysm_utils.import_model_menu.properties.render_layers_first.desc") }}</p>
            </div>

            <div style="width: 20%; margin: 0 auto;">
                <input type="checkbox" v-model="properties['render_layers_first']" style="width: 100%;">
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
</style>
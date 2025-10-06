<script>
import {join} from "path";
import {readLanguageFile, writeLanguageFile} from "../../util/language";

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
        refLanguageMaps: {
            type: Object,
            required: true
        },
        packDirectory: {
            type: Object,
            required: true
        }
    },
    mounted() {
        // 在挂载后执行语言文件获取，渲染初始化的语言文件界面
        this.getCurrentLanguageMaps();
    },
    data() {
        return {
            language: "en_us",
            clickKey: "",
            clickBlurIndex: 0,
            currentLanguageMaps: {},
            availableLanguages: [
                "en_us", "zh_cn", "zh_tw",
                "ru_ru", "ja_jp", "ko_kr",
                "vi_vn", "pt_br", "es_es",
                "id_id", "tr_tr"
            ],
            colorList: {
                "black": {
                    "code": "§0",
                    "rgb": "#000000"
                },
                "dark_blue": {
                    "code": "§1",
                    "rgb": "#0000AA"
                },
                "dark_green": {
                    "code": "§2",
                    "rgb": "#00AA00"
                },
                "dark_aqua": {
                    "code": "§3",
                    "rgb": "#00AAAA"
                },
                "dark_red": {
                    "code": "§4",
                    "rgb": "#AA0000"
                },
                "dark_purple": {
                    "code": "§5",
                    "rgb": "#AA00AA"
                },
                "gold": {
                    "code": "§6",
                    "rgb": "#FFAA00"
                },
                "gray": {
                    "code": "§7",
                    "rgb": "#AAAAAA"
                },
                "dark_gray": {
                    "code": "§8",
                    "rgb": "#555555"
                },
                "blue": {
                    "code": "§9",
                    "rgb": "#5555FF"
                },
                "green": {
                    "code": "§a",
                    "rgb": "#55FF55"
                },
                "aqua": {
                    "code": "§b",
                    "rgb": "#55FFFF"
                },
                "red": {
                    "code": "§c",
                    "rgb": "#FF5555"
                },
                "light_purple": {
                    "code": "§d",
                    "rgb": "#FF55FF"
                },
                "yellow": {
                    "code": "§e",
                    "rgb": "#FFFF55"
                },
                "white": {
                    "code": "§f",
                    "rgb": "#FFFFFF"
                }
            }
        };
    },
    methods: {
        tl: tl,
        saveLanguageButton: function () {
            let langPath = join(this.packDirectory, this.ysmJson["language_path"] ?? "lang");
            writeLanguageFile(this.language, langPath, this.currentLanguageMaps);
            Blockbench.showQuickMessage(tl("menu.ysm_utils.save_success"), 3000);
        },
        clickLanguageButton: function (language) {
            if (this.language !== language) {
                let oldLangPath = join(this.packDirectory, this.ysmJson["language_path"] ?? "lang");
                writeLanguageFile(this.language, oldLangPath, this.currentLanguageMaps);
            }
            this.language = language;
            this.getCurrentLanguageMaps();
        },
        getCurrentLanguageMaps: function () {
            let currentLangPath = join(this.packDirectory, this.ysmJson["language_path"] ?? "lang");
            let languageMaps = {};
            readLanguageFile(this.language, currentLangPath, languageMaps);
            this.currentLanguageMaps = languageMaps;
        },
        addColorCode: function (code, key) {
            this.addStyleCode(code, key);
        },
        addStyleCode: function (code, key) {
            let rawText = this.currentLanguageMaps[key] ?? "";
            this.currentLanguageMaps[key] = rawText.slice(0, this.clickBlurIndex) + code + rawText.slice(this.clickBlurIndex);
            this.$forceUpdate();
        },
        copyText: function (key) {
            let rawText = this.currentLanguageMaps[key] ?? "";
            let copyText = this.refLanguageMaps[key] ?? "";
            this.currentLanguageMaps[key] = rawText.slice(0, this.clickBlurIndex) + copyText + rawText.slice(this.clickBlurIndex);
            this.$forceUpdate();
        },
        getColorCodeName: function (name) {
            return tl(`color.ysm_utils.${name}.name`);
        },
        getClickBlurIndex: function (e) {
            this.clickBlurIndex = e.srcElement.selectionStart;
        }
    },
    computed: {}
};
</script>

<template>
    <div @click="clickKey=''">
        <div style="margin-bottom: 0; text-align: center">
            <button v-for="local in availableLanguages"
                    class="language-button" :class="{'language-button-selected': language===local}"
                    @click="clickLanguageButton(local)"
                    :disabled="language===local">{{ tl(`dialog.ysm_utils.language_edit.language.${local}`) }}
            </button>
        </div>

        <div style="height: 600px; overflow-y: auto;">
            <div class="language-edit-element" v-for="(value,key) in refLanguageMaps">
                <p class="language-edit-element-key">{{ key }}</p>
                <p class="language-edit-element-value">
                    <input type="text" style="width: 100%" v-model="refLanguageMaps[key]" readonly>
                    <i @click="copyText(key)" class="fas fa-copy add-style"></i>
                </p>
                <div class="language-edit-element-input" @click.stop="clickKey=key">
                    <div v-show="clickKey===key">
                        <i :style="{'color': color.rgb}" :title="getColorCodeName(name)"
                           @click="addColorCode(color.code, key)"
                           class="fas fa-square-full add-color" v-for="(color, name) in colorList"></i>
                        <i :title="tl('style.ysm_utils.bold.name')"
                           @click="addStyleCode('§l', key)"
                           class="fas fa-bold add-style"></i>
                        <i :title="tl('style.ysm_utils.strikethrough.name')"
                           @click="addStyleCode('§m', key)" class="fas fa-strikethrough add-style"></i>
                        <i :title="tl('style.ysm_utils.underline.name')"
                           @click="addStyleCode('§n', key)"
                           class="fas fa-underline add-style"></i>
                        <i :title="tl('style.ysm_utils.italic.name')"
                           @click="addStyleCode('§o', key)"
                           class="fas fa-italic add-style"></i>
                        <i :title="tl('style.ysm_utils.reset.name')"
                           @click="addStyleCode('§r', key)"
                           class="fas fa-eraser add-style"></i>
                    </div>
                    <input type="text" style="width: 100%" v-model="currentLanguageMaps[key]" @blur="getClickBlurIndex">
                </div>
            </div>
        </div>

        <div style="margin-top: 20px">
            <button style="width: 98%; height: 40px; font-size: 20px" @click="saveLanguageButton">
                {{ tl("dialog.save") }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.language-edit-element {
    background-color: rgba(23, 25, 29, 0.95);
    box-shadow: 0 0 10px rgba(24, 26, 31, 0.95);
    width: 98%;
    margin-top: 10px;
    padding: 10px;
    border-radius: 3px;
}

.language-button {
    width: 100px;
    height: 50px;
    margin-left: 5px
}

.language-button-selected {
    background-color: #2b2d34;
    height: 60px;
    max-height: 60px;
}

.language-edit-element-key {
    color: #6a6a6d;
    font-size: small;
}

.language-edit-element-value {
    color: #aaaaad;
    font-size: large;
}

.language-edit-element-input {
    font-size: x-large;
    color: #f4f3ff;
    border-color: #2b2b2b;
    border-top-style: dotted;
    border-top-width: 2px;
    border-bottom-style: dotted;
    border-bottom-width: 2px;
}

.add-color {
    border-color: rgb(128, 128, 128);
    border-width: 1px;
    border-style: solid;
    margin: 2px;
}

.add-color:hover {
    border-color: red;
    border-width: 1px;
    border-style: solid;
}

.add-style:hover {
    color: red;
}
</style>
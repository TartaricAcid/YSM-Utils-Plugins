<script>
import {join} from "path";
import {importArmFile, importArrowFile, importMainFile} from "../../import/file_import.js";
import {openImportDialog} from "../../import/open_import_dialog.js";
import {getCacheYsmImportConfig, saveCacheYsmImportConfig} from "../../menu/cache_info_menu.js";

export default {
    props: {
        importTypeMenuDialog: {
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
        importMainModel: function () {
            importMainFile(this.packDirectory, this.ysmJson, this.importTypeMenuDialog, this.importConfig);
        },
        importArmModel: function () {
            importArmFile(this.packDirectory, this.ysmJson, this.importTypeMenuDialog);
        },
        importArrowModel: function () {
            importArrowFile(this.packDirectory, this.ysmJson, this.importTypeMenuDialog);
        },
        loadInfo: function () {
            openImportDialog(this.packDirectory);
            this.importTypeMenuDialog.close();
        },
        saveConfig: function () {
            saveCacheYsmImportConfig(this.importConfig);
        }
    },
    computed: {
        playerMainModelFileExist: function () {
            let result = this.ysmJson?.["files"]?.["player"]?.["model"]?.["main"];
            return result && result.endsWith(".json");
        },
        playerArmModelFileExist: function () {
            let result = this.ysmJson?.["files"]?.["player"]?.["model"]?.["arm"];
            return result && result.endsWith(".json");
        },
        arrowModelFileExist: function () {
            let result = this.ysmJson?.["files"]?.["arrow"]?.["model"];
            return result && result.endsWith(".json");
        },
        importConfig: function () {
            return getCacheYsmImportConfig();
        }
    }
};
</script>

<template>
    <div>
        <div class="type-main">
            <div class="type-container">
                <button v-if="playerMainModelFileExist" class="type-button" @click="importMainModel">
                    <i class="fas fa-universal-access fa-5x"></i><br>
                    {{ tl("menu.ysm_utils.import_type.player_main") }}
                </button>

                <button v-if="playerArmModelFileExist" class="type-button" @click="importArmModel">
                    <i class="fas fa-hand-paper fa-5x"></i><br>
                    {{ tl("menu.ysm_utils.import_type.player_arm") }}
                </button>

                <button v-if="arrowModelFileExist" class="type-button" @click="importArrowModel">
                    <i class="fas fa-angle-double-up fa-5x"></i><br>
                    {{ tl("menu.ysm_utils.import_type.arrow") }}
                </button>

                <button class="type-button" @click="loadInfo">
                    <i class="fas fa-info fa-5x"></i><br>
                    {{ tl("menu.ysm_utils.load_info_menu.name") }}
                </button>
            </div>
        </div>

        <div class="type-import-div">
            <div>
                <input type="checkbox" v-model="importConfig['load_animation']" @change="saveConfig"/>
                <label>{{ tl("menu.ysm_utils.direct_import.import_animation") }}</label>
            </div>
            <div>
                <input type="checkbox" v-model="importConfig['load_animation_controllers']" @change="saveConfig"/>
                <label>{{ tl("menu.ysm_utils.direct_import.import_animation_controller") }}</label>
            </div>
        </div>
    </div>
</template>

<style scoped>
.type-main {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.type-container {
    display: flex;
    justify-content: space-between;
}

.type-button {
    height: 250px;
    width: 150px;
    margin-top: 10px;
    margin-right: 5px;
    font-size: large;
}

.type-import-div {
    margin-top: 10px;
    margin-right: 5px;
    margin-left: 10px;
    font-size: large;
}

.type-button > i {
    margin-bottom: 35px;
}
</style>
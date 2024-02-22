<script>
import {mkdirs} from "../utils/filesystem";
import femaleMainModel from "../../assets/model/female/main.json"
import femaleArmModel from "../../assets/model/female/arm.json"
import femaleArrowModel from "../../assets/model/female/arrow.json"
import femaleMainAnimation from "../../assets/model/female/main.animation.json"
import femaleArmAnimation from "../../assets/model/female/arm.animation.json"
import femaleExtraAnimation from "../../assets/model/female/extra.animation.json"
import femaleCarryOnAnimation from "../../assets/model/female/carryon.animation.json"
import femaleTacAnimation from "../../assets/model/female/tac.animation.json"
import maleMainModel from "../../assets/model/male/main.json"
import maleArmModel from "../../assets/model/male/arm.json"
import maleMainAnimation from "../../assets/model/male/main.animation.json"
import maleTacAnimation from "../../assets/model/male/tac.animation.json"
import {addToYsmCache} from "./load_cache";

export default {
    name: "create_dialog",
    props: {
        parent: {
            type: Object,
            required: true
        },
        modelType: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            modelId: "",
            packIdBorderColor: "#17191d",
            packIdBorderSize: "1px",
            tip: "",
            canSubmit: false
        };
    },
    methods: {
        tl: tl,
        setWarning: function () {
            this.packIdBorderColor = "#FF0000";
            this.packIdBorderSize = "1px";
            this.canSubmit = false;
        },
        resetWarning: function () {
            this.tip = "";
            this.canSubmit = true;
            this.packIdBorderColor = "#17191d";
            this.packIdBorderSize = "1px";
        },
        checkId: function () {
            this.modelId = this.modelId.toLowerCase().replace(/\s|-/g, "_");
            if (!this.modelId) {
                this.tip = tl("tip.ysm_utils.create_dialog.is_empty");
                this.setWarning();
                return;
            }
            if (!(/^[\w.]+$/.test(this.modelId))) {
                this.tip = tl("tip.ysm_utils.create_dialog.char_invalid");
                this.setWarning();
                return;
            }
            this.resetWarning();
        },
        submit: function () {
            if (!this.modelId) {
                this.tip = tl("tip.ysm_utils.create_dialog.is_empty");
                this.setWarning();
                return;
            }
            if (this.canSubmit) {
                let filePaths = electron.dialog.showOpenDialogSync(currentwindow, {
                    properties: ["openDirectory"],
                    title: tl("tip.ysm_utils.create_dialog.choose_folder")
                });
                if (filePaths) {
                    let path = filePaths[0];
                    if (path === undefined || path === null) {
                        return;
                    }
                    let root = `${path}/${this.modelId}`;
                    mkdirs(root)
                    if (this.modelType === "female") {
                        Blockbench.writeFile(`${root}/main.json`, {content: compileJSON(femaleMainModel)});
                        Blockbench.writeFile(`${root}/arm.json`, {content: compileJSON(femaleArmModel)});
                        Blockbench.writeFile(`${root}/arrow.json`, {content: compileJSON(femaleArrowModel)});
                        Blockbench.writeFile(`${root}/main.animation.json`, {content: compileJSON(femaleMainAnimation)});
                        Blockbench.writeFile(`${root}/arm.animation.json`, {content: compileJSON(femaleArmAnimation)});
                        Blockbench.writeFile(`${root}/extra.animation.json`, {content: compileJSON(femaleExtraAnimation)});
                        Blockbench.writeFile(`${root}/carryon.animation.json`, {content: compileJSON(femaleCarryOnAnimation)});
                        Blockbench.writeFile(`${root}/tac.animation.json`, {content: compileJSON(femaleTacAnimation)});
                    } else {
                        Blockbench.writeFile(`${root}/main.json`, {content: compileJSON(maleMainModel)});
                        Blockbench.writeFile(`${root}/arm.json`, {content: compileJSON(maleArmModel)});
                        Blockbench.writeFile(`${root}/arrow.json`, {content: compileJSON(femaleArrowModel)});
                        Blockbench.writeFile(`${root}/main.animation.json`, {content: compileJSON(maleMainAnimation)});
                        Blockbench.writeFile(`${root}/arm.animation.json`, {content: compileJSON(femaleArmAnimation)});
                        Blockbench.writeFile(`${root}/extra.animation.json`, {content: compileJSON(femaleExtraAnimation)});
                        Blockbench.writeFile(`${root}/carryon.animation.json`, {content: compileJSON(femaleCarryOnAnimation)});
                        Blockbench.writeFile(`${root}/tac.animation.json`, {content: compileJSON(maleTacAnimation)});
                    }
                    Blockbench.readFile([`${root}/arrow.json`, `${root}/arm.json`, `${root}/main.json`], {readtype: "text"}, files => {
                        files.forEach(file => loadModelFile(file))
                        Blockbench.readFile([`${root}/main.animation.json`, `${root}/arm.animation.json`, `${root}/extra.animation.json`, `${root}/carryon.animation.json`, `${root}/tac.animation.json`], {readtype: "text"}, files => {
                            files.forEach(file => Animator.loadFile(file))
                            Blockbench.notification(tl("tip.ysm_utils.create_dialog.success.title"), tl("tip.ysm_utils.create_dialog.success.desc", [path]));
                            addToYsmCache(root);
                            this.parent.hide();
                        });
                    });
                }
            }
        }
    }
};
</script>

<template>
    <div style="margin-left: 0">
        <div>
            <h5 style="margin: 0; padding: 0">{{ tl("menu.ysm_utils.create_default_model.new") }}
                <span style="color: #ff0000">*</span></h5>
            <p style="color: #6a6a6d">{{ tl("menu.ysm_utils.create_default_model.model_id") }}</p>
            <input :style="{'border-color': packIdBorderColor, 'border-width': this.packIdBorderSize}"
                   @blur="checkId"
                   placeholder="" required
                   style="border-radius: 1px; margin-top:5px; padding: 5px; width: 100%; height:50px; font-size: 30px; background-color: #1c2026; border-style: solid"
                   type="text"
                   v-model="modelId">
        </div>
        <div style="margin-top: 20px; height: 20px">
            <p style="color: red">{{ tip }}</p>
        </div>
        <div style="margin-top: 20px">
            <button @click="submit"
                    style="width: 100%; height:50px; border-radius: 1px">
                <h5>{{ tl("menu.ysm_utils.create_default_model.create") }}</h5></button>
        </div>
    </div>
</template>

<style scoped>
</style>
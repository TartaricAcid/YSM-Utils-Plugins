<script>
import {join} from "path";
import {openImportDialog, saveYsmFile} from "../../import/open_import_dialog.js";

export default {
    props: {
        editExtraAnimationButtonsDialog: {
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
        }
    },
    beforeMount() {
        this.extraAnimationButtons["config_forms"].forEach(form => {
            if (form["type"] === "radio") {
                let tmpLabels = form["tmp_labels"] = [];
                Object.keys(form["labels"]).forEach(key => {
                    let value = form["labels"][key];
                    tmpLabels.push([key, value]);
                });
            }
            form["uuid"] = crypto.randomUUID();
            this.configForms.push(form);
        });
    },
    data() {
        return {
            form_type: ["range", "checkbox", "radio"],
            configForms: [],
            options: {
                handle: ".handle",
                animation: 100,
                onUpdate: this.onUpdateSort
            }
        };
    },
    methods: {
        join,
        tl,
        onUpdateSort: function (event) {
            this.configForms.splice(event.newIndex, 0, this.configForms.splice(event.oldIndex, 1)[0]);
            this.updateAllConfigForm();
            this.$forceUpdate();
        },
        deleteNewConfigForm: function (formIndex) {
            Blockbench.showMessageBox({
                icon: "fa-warning",
                title: tl("level.ysm_utils.warning"),
                message: tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.delete"),
                width: 600,
                buttons: [tl("dialog.confirm"), tl("dialog.cancel")],
                confirm: 0,
                cancel: 1
            }, (button) => {
                if (button === 0) {
                    this.configForms.splice(formIndex, 1);
                    this.updateAllConfigForm();
                    this.$forceUpdate();
                }
            });
        },
        addNewConfigForm: function () {
            this.configForms.push({
                "type": "checkbox",
                "title": "",
                "description": "",
                "value": "",
                "tmp_labels": [],
                "uuid": crypto.randomUUID()
            });
            this.updateAllConfigForm();
            this.$forceUpdate();
        },
        deleteConfigFormLabels: function (formIndex, index) {
            this.configForms[formIndex]["tmp_labels"].splice(index, 1);
            this.updateSingleConfigForm(formIndex);
            this.$forceUpdate();
        },
        addNewConfigFormLabels: function (formIndex) {
            this.configForms[formIndex]["tmp_labels"].push(["", ""]);
            this.updateSingleConfigForm(formIndex);
            this.$forceUpdate();
        },
        updateSingleConfigForm: function (formIndex) {
            let tmp = {};
            for (let value of this.configForms[formIndex]["tmp_labels"]) {
                if (!(value[0] in tmp)) {
                    tmp[value[0]] = value[1];
                }
            }
            this.configForms[formIndex]["labels"] = tmp;
        },
        updateAllConfigForm: function () {
            let tmp = [];
            this.configForms.forEach((forms, index) => {
                if (forms["tmp_labels"]) {
                    this.updateSingleConfigForm(index);
                }
                tmp.push(forms);
            });
            this.extraAnimationButtons["config_forms"] = tmp;
        },
        onSaveExtraAnimationButtons: function (close) {
            this.updateAllConfigForm();
            let ysmJsonPath = join(this.packDirectory, "ysm.json");
            saveYsmFile(JSON.parse(JSON.stringify(this.ysmJson)), ysmJsonPath);
            if (close) {
                this.editExtraAnimationButtonsDialog.close();
            }
        }
    },
    computed: {
        properties: function () {
            return this.ysmJson["properties"];
        },
        extraAnimationButtons: function () {
            return this.properties["extra_animation_buttons"][this.index];
        }
    }
};
</script>

<template>
    <div class="properties">
        <div class="all-item">
            <div class="properties-item">
                <p class="title">{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.id") }}</p>
                <p class="desc">{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.id.desc") }}</p>
                <input class="input" type="text"
                       v-model.trim='extraAnimationButtons["id"]'
                       :placeholder="tl('menu.ysm_utils.required_fields')">
            </div>

            <div class="properties-item">
                <p class="title">{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.name") }}</p>
                <p class="desc">
                    {{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.name.desc") }}
                </p>
                <input class="input" type="text"
                       v-model.trim='extraAnimationButtons["name"]'
                       :placeholder="tl('menu.ysm_utils.required_fields')">
            </div>

            <div class="properties-item">
                <p class="title">
                    {{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms") }}
                </p>
                <p class="desc">
                    {{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.desc") }}
                </p>

                <ul class="list-group" v-sortable="options">
                    <li class="list-group-item config_forms" v-for="(form, formIndex) in configForms"
                        :key="form['uuid']">

                        <div class="container">
                            <div class="right-align">
                                <button class="icon-button handle">
                                    <i class="fas fa-arrows-alt"></i>
                                </button>
                                <button class="icon-button" @click="deleteNewConfigForm(formIndex)">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </div>

                        <div class="horizontal-item">
                            <p class="horizontal-text">
                                {{
                                    tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.type")
                                }}
                            </p>
                            <select class="horizontal-option" v-model="form['type']">
                                <option :value="form['type']" selected>
                                    {{
                                        tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.type." + form["type"])
                                    }}
                                </option>
                                <option v-for="type in form_type.filter(item=>item!==form['type'])" :value="type">
                                    {{
                                        tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.type." + type)
                                    }}
                                </option>
                            </select>
                        </div>

                        <div class="horizontal-item">
                            <p class="horizontal-text">
                                {{
                                    tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.title")
                                }}
                            </p>
                            <input class="horizontal-input" type="text" v-model.trim='form["title"]'
                                   :placeholder="tl('menu.ysm_utils.required_fields')">
                        </div>

                        <div class="horizontal-item">
                            <p class="horizontal-text">
                                {{
                                    tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.description")
                                }}
                            </p>
                            <input class="horizontal-input" type="text" v-model.trim='form["description"]'
                                   :placeholder="tl('menu.ysm_utils.required_fields')">
                        </div>

                        <div class="horizontal-item">
                            <p class="horizontal-text">
                                {{
                                    tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.value")
                                }}
                            </p>
                            <input class="horizontal-input" type="text" v-model.trim='form["value"]'
                                   :placeholder="tl('menu.ysm_utils.required_fields')">
                        </div>

                        <div class="horizontal-item" v-if="form['type']==='range'">
                            <p class="horizontal-text">
                                {{
                                    tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.step")
                                }}
                            </p>
                            <input class="horizontal-input" type="text" v-model.number='form["step"]'>
                        </div>

                        <div class="horizontal-item" v-if="form['type']==='range'">
                            <p class="horizontal-text">
                                {{
                                    tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.min")
                                }}
                            </p>
                            <input class="horizontal-input" type="text" v-model.number='form["min"]'>
                        </div>

                        <div class="horizontal-item" v-if="form['type']==='range'">
                            <p class="horizontal-text">
                                {{
                                    tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.max")
                                }}
                            </p>
                            <input class="horizontal-input" type="text" v-model.number='form["max"]'>
                        </div>

                        <div v-if="form['type']==='radio'" style="margin-top: 10px">
                            <p style="text-align: center">
                                {{
                                    tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.labels")
                                }}
                            </p>
                            <div style="display: flex; flex-wrap: wrap; margin-top: 2px">
                                <div v-for="(value,index) in form['tmp_labels']"
                                     style="width: 49%; margin-left: 2px; margin-top: 2px; overflow: visible;">
                                    <input class="labels" style="width: 30%" type="text" v-model.trim="value[0]"
                                           @blur="updateSingleConfigForm(formIndex)">
                                    <input class="labels" style="width: 50%" type="text" v-model.trim="value[1]"
                                           @blur="updateSingleConfigForm(formIndex)">
                                    <i class="fa-solid fa-trash-can extra-delete"
                                       @click="deleteConfigFormLabels(formIndex,index)"></i>
                                </div>

                                <button style="width: 44.8%; margin-left: 2px; margin-top: 2px;"
                                        @click="addNewConfigFormLabels(formIndex)">
                                    <i class="fa-solid fa-plus" style="vertical-align: middle;"></i>
                                    <span>{{
                                            tl("menu.ysm_utils.load_info_menu.properties.extra_animation.add")
                                        }}</span>
                                </button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="properties-item">
                <button style="width: 100%;" @click="addNewConfigForm">
                    {{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation.add") }}
                </button>
            </div>
        </div>

        <div style="margin-top: 20px; margin-bottom: 10px">
            <button style="width: 48%; margin-right: 10px" @click="onSaveExtraAnimationButtons(false)">
                {{ tl("menu.ysm_utils.save") }}
            </button>
            <button style="width: 48%" @click="onSaveExtraAnimationButtons(true)">
                {{ tl("menu.ysm_utils.save_quit") }}
            </button>
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
    width: 100%;
    margin-top: 10px;
    margin-bottom: 20px
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

.horizontal-item {
    display: flex;
}

.horizontal-text {
    width: 12%;
    margin-top: 7px;
    font-size: 15px;
}

.horizontal-input {
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

.horizontal-option {
    flex: 1;
    border-radius: 1px;
    margin-top: 5px;
    padding: 2px 2px 2px 5px;
    height: 30px;
    font-size: 15px;
}

.all-item {
    height: 800px;
    overflow: auto;
    padding: 20px 30px 20px 30px;
    border-radius: 2px;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(24, 26, 31, 0.5);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3)
}

.config_forms {
    margin-top: 5px;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 2px;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(24, 26, 31, 0.5);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3)
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

.labels {
    border-radius: 1px;
    margin-top: 5px;
    margin-left: 5px;
    padding: 2px 2px 2px 5px;
    height: 30px;
    font-size: 15px;
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

.container {
    display: flex;
    justify-content: flex-end;
}

.right-align {
    margin-left: auto;
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
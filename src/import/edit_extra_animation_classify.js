import extraAnimationClassifyVue from "../vue/import/extra_animation_classify.vue";
import extraAnimationInClassifyVue from "../vue/import/extra_animation_in_classify.vue";

export function editExtraAnimationClassifyDialog(ysmJson, packDirectory, index) {
    let editExtraAnimationClassifyDialog = new Dialog({
        title: "menu.ysm_utils.load_info_menu.properties.extra_animation_classify",
        cancel_on_click_outside: false,
        width: 800,
        singleButton: true,
        component: {
            data() {
                return {
                    editExtraAnimationClassifyDialog: editExtraAnimationClassifyDialog,
                    ysmJson: ysmJson,
                    packDirectory: packDirectory,
                    index: index,
                };
            },
            components: {
                extraAnimationClassifyVue: extraAnimationClassifyVue,
            },
            template: `
                <div>
                    <extraAnimationClassifyVue :edit-extra-animation-classify-dialog="editExtraAnimationClassifyDialog"
                                               :ysm-json="ysmJson" :index="index"
                                               :pack-directory='packDirectory'/>
                </div>`
        }
    });
    editExtraAnimationClassifyDialog.show();
    if (editExtraAnimationClassifyDialog.object && editExtraAnimationClassifyDialog.object.style) {
        editExtraAnimationClassifyDialog.object.style["max-width"] = "800px";
    }
}

export function editExtraAnimationInClassifyDialog(ysmJson, packDirectory, index, indexInClassify) {
    let editExtraAnimationInClassifyDialog = new Dialog({
        title: "menu.ysm_utils.load_info_menu.properties.extra_animation",
        cancel_on_click_outside: false,
        width: 800,
        singleButton: true,
        component: {
            data() {
                return {
                    editExtraAnimationInClassifyDialog: editExtraAnimationInClassifyDialog,
                    ysmJson: ysmJson,
                    packDirectory: packDirectory,
                    index: index,
                    indexInClassify: indexInClassify
                };
            },
            components: {
                extraAnimationInClassifyVue: extraAnimationInClassifyVue,
            },
            template: `
                <div>
                    <extraAnimationInClassifyVue
                        :edit-extra-animation-dialog="editExtraAnimationInClassifyDialog"
                        :ysm-json="ysmJson" :index="index" :index-in-classify="indexInClassify"
                        :pack-directory='packDirectory'/>
                </div>`
        }
    });
    editExtraAnimationInClassifyDialog.show();
}
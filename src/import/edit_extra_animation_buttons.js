import extraAnimationButtonsVue from "../vue/import/extra_animation_buttons.vue";

export function editExtraAnimationButtonsDialog(ysmJson, packDirectory, index) {
    let editExtraAnimationButtonsDialog = new Dialog({
        title: "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons",
        cancel_on_click_outside: false,
        width: 900,
        singleButton: true,
        component: {
            data() {
                return {
                    editExtraAnimationButtonsDialog: editExtraAnimationButtonsDialog,
                    ysmJson: ysmJson,
                    packDirectory: packDirectory,
                    index: index,
                };
            },
            components: {
                extraAnimationButtonsVue: extraAnimationButtonsVue,
            },
            template: `
                <div>
                    <extraAnimationButtonsVue :edit-extra-animation-buttons-dialog="editExtraAnimationButtonsDialog"
                                              :ysm-json="ysmJson" :index="index"
                                              :pack-directory='packDirectory'/>
                </div>`
        }
    });
    editExtraAnimationButtonsDialog.show();
    if (editExtraAnimationButtonsDialog.object && editExtraAnimationButtonsDialog.object.style) {
        editExtraAnimationButtonsDialog.object.style["max-width"] = "900px";
    }
}
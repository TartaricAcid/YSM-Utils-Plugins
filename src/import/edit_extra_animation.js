import extraAnimationVue from "../vue/import/extra_animation.vue";

export function editExtraAnimationDialog(ysmJson, packDirectory, index) {
    let editExtraAnimationDialog = new Dialog({
        title: "menu.ysm_utils.load_info_menu.properties.extra_animation",
        cancel_on_click_outside: false,
        width: 600,
        singleButton: true,
        component: {
            data() {
                return {
                    editExtraAnimationDialog: editExtraAnimationDialog,
                    ysmJson: ysmJson,
                    packDirectory: packDirectory,
                    index: index,
                };
            },
            components: {
                extraAnimationVue: extraAnimationVue,
            },
            template: `
                <div>
                    <extraAnimationVue :edit-extra-animation-dialog="editExtraAnimationDialog"
                                       :ysm-json="ysmJson" :index="index"
                                       :pack-directory='packDirectory'/>
                </div>`
        }
    });
    editExtraAnimationDialog.show();
}
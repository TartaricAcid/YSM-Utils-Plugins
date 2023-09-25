import createDialogVue from "./create_dialog.vue";


export var setModelIdDialog = function (modelType) {
    let dialog = new Dialog("set_model_id", {
        title: "menu.ysm_utils.set_model_id",
        width: 800,
        singleButton: true,
        component: {
            data() {
                return {
                    parent: dialog,
                    modelType: modelType,
                };
            },
            components: {createDialogVue},
            template: "<createDialogVue :parent='parent' :model-type='modelType'/>"
        }
    });
    return dialog;
}
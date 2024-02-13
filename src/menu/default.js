import defaultVue from "./default.vue";


export var createDefaultModel = new Action("ysm_utils.create_default_model", {
    name: tl("menu.ysm_utils.create_default_model"),
    icon: "fa-file-alt",
    click: function () {
        let createDefaultDialog = new Dialog("create_default_model", {
            title: "menu.ysm_utils.create_default_model",
            width: 800,
            singleButton: true,
            component: {
                data() {
                    return {
                        parent: createDefaultDialog
                    };
                },
                components: {defaultVue},
                template: "<defaultVue :parent='parent'/>"
            }
        });
        createDefaultDialog.show();
    }
});
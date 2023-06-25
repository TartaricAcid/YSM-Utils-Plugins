import modelInfoVue from "./model_info.vue";

export var openModelInfo = new Action("ysm_utils.add_model_info", {
    name: "添加信息",
    icon: "info",
    click: function () {
        if (Project.selected && Format.id === "bedrock") {
            let openModelInfoDialog = new Dialog({
                title: "dialog.menu.ysm_utils.add_model_info.title",
                width: 600,
                singleButton: true,
                onCancel: function () {
                },
                component: {
                    data() {
                        return {
                            parent: openModelInfoDialog
                        };
                    },
                    components: { modelInfoVue },
                    template: "<modelInfoVue :parent='parent'/>"
                }
            });
            openModelInfoDialog.show();
        }
    }
});
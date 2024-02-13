import modelInfoVue from "./model_info.vue";

export var openModelInfo = new Action("ysm_utils.add_model_info", {
    name: "menu.ysm_utils.add_model_info",
    icon: "info",
    click: function () {
        if (!Project) {
            electron.dialog.showMessageBoxSync(currentwindow, {
                title: tl("menu.ysm_utils.add_model_info.not_open.title"),
                message: tl("menu.ysm_utils.add_model_info.not_open.desc"),
                type: "warning"
            });
            return;
        }
        if (Project.selected && Format.id === "bedrock" && !Project.save_path.endsWith(".bbmodel") && Project['ysm_extra_info']) {
            let openModelInfoDialog = new Dialog({
                title: "menu.ysm_utils.add_model_info",
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
                    components: {modelInfoVue},
                    template: "<modelInfoVue :parent='parent'/>"
                }
            });
            openModelInfoDialog.show();
        } else {
            if (!Format.id === "bedrock" || Project.save_path.endsWith(".bbmodel")) {
                electron.dialog.showMessageBoxSync(currentwindow, {
                    title: tl("menu.ysm_utils.add_model_info.format_error.title"),
                    message: tl("menu.ysm_utils.add_model_info.format_error.desc"),
                    type: "warning"
                });
                return;
            }
            if (!Project['ysm_extra_info']) {
                electron.dialog.showMessageBoxSync(currentwindow, {
                    title: tl("menu.ysm_utils.add_model_info.no_data.title"),
                    message: tl("menu.ysm_utils.add_model_info.no_data.desc"),
                    type: "warning"
                });
            }
        }
    }
});
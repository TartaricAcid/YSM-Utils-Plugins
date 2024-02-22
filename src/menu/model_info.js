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
            if (Project.export_path.endsWith("main.json")) {
                let path = Project.export_path.substring(0, Project.export_path.length - 10) + "/info.json";
                if (fs.existsSync(path)) {
                    checkInfoData(JSON.parse(fs.readFileSync(path)));
                }
            }
            let openModelInfoDialog = new Dialog({
                title: "menu.ysm_utils.add_model_info",
                width: 600,
                singleButton: true,
                cancel_on_click_outside: false,
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

function checkInfoData(extraInfo) {
    if (extraInfo) {
        let extraInfoOut = Project['ysm_extra_info']
        if (extraInfo["name"]) {
            extraInfoOut["name"] = extraInfo["name"];
        }
        if (extraInfo["tips"]) {
            extraInfoOut["tips"] = extraInfo["tips"];
        }
        if (extraInfo["authors"] && Array.isArray(extraInfo["authors"]) && extraInfo["authors"].length > 0) {
            extraInfoOut["authors"] = extraInfo["authors"].join("\n");
        }
        if (extraInfo["free"]) {
            extraInfoOut["free"] = extraInfo["free"];
        }
        if (extraInfo["license"]) {
            extraInfoOut["license"] = extraInfo["license"];
        }
        if (extraInfo["extra_animation_names"] && Array.isArray(extraInfo["extra_animation_names"]) && extraInfo["extra_animation_names"].length > 0) {
            extraInfoOut["extra_animation_names"] = extraInfo["extra_animation_names"];
        }
    }
}
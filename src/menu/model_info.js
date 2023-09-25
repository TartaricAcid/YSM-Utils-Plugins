import modelInfoVue from "./model_info.vue";

export var openModelInfo = new Action("ysm_utils.add_model_info", {
    name: "添加信息",
    icon: "info",
    click: function () {
        if (!Project) {
            electron.dialog.showMessageBoxSync(currentwindow, {
                title: "还未打开任何模型文件",
                message: "请打开模型文件后，再点击添加信息选项！",
                type: "warning"
            });
            return;
        }
        if (Project.selected && Format.id === "bedrock" && !Project.save_path.endsWith(".bbmodel") && Project['ysm_extra_info']) {
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
                    components: {modelInfoVue},
                    template: "<modelInfoVue :parent='parent'/>"
                }
            });
            openModelInfoDialog.show();
        } else {
            if (!Format.id === "bedrock" || Project.save_path.endsWith(".bbmodel")) {
                electron.dialog.showMessageBoxSync(currentwindow, {
                    title: "文件格式错误",
                    message: "打开的文件不是 json 格式的基岩版模型！\n请将其导出为 json 格式的基岩版模型，再重新打开！",
                    type: "warning"
                });
                return;
            }
            if (!Project['ysm_extra_info']) {
                electron.dialog.showMessageBoxSync(currentwindow, {
                    title: "没有读取到数据",
                    message: "插件还未加载就打开了模型，导致数据未能读取。\n请不要关闭 Blockbench，只需重新打开当前模型即可！",
                    type: "warning"
                });
            }
        }
    }
});
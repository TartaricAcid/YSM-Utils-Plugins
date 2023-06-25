import YSM from "../package.json";
import { openModelInfo } from "./model_info";
import { registerYsmEvent, removeYsmEvent } from "./event"

(function () {
    Plugin.register(YSM.name, {
        title: "Yes Steve Model Plugins",
        author: YSM.author,
        description: "是！史蒂夫模组插件！",
        icon: "card_membership",
        version: YSM.version,
        variant: "desktop",
        min_version: "4.7.0",
        onload() {
            Language.addTranslations("zh", {
                "menu.ysm_utils": "是！史蒂夫",
                "dialog.menu.ysm_utils.add_model_info.title": "添加信息",
            });
            registerYsmEvent();
            new BarMenu("ysm_utils", [
                "ysm_utils.add_model_info"
            ]);
            MenuBar.update();
        },
        onunload() {
            delete MenuBar.menues["ysm_utils"];
            MenuBar.update();
            openModelInfo.delete();
            removeYsmEvent();
        }
    });
})();
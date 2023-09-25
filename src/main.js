import YSM from "../package.json";
import {openModelInfo} from "./menu/model_info";
import {createDefaultModel} from "./menu/default";
import {registerYsmEvent, removeYsmEvent} from "./event/event";
import {loadYsmModel} from "./menu/load";
import {CACHE_YSM_MODEL_ACTION, initCacheYsmFoldersAction} from "./menu/load_cache";

(function () {
    Plugin.register(YSM.name, {
        title: "Yes Steve Model Plugins",
        author: YSM.author,
        description: "是！史蒂夫模组插件！",
        icon: "card_membership",
        version: YSM.version,
        variant: "desktop",
        min_version: "4.0.0",
        await_loading: true,
        onload() {
            Language.addTranslations("zh", {
                "menu.ysm_utils": "是！史蒂夫",
                "menu.ysm_utils.set_model_id": "输入模型 ID",
                "menu.ysm_utils.create_default_model": "创建默认模型",
                "dialog.menu.ysm_utils.add_model_info.title": "添加信息",
            });
            initCacheYsmFoldersAction();
            registerYsmEvent();
            new BarMenu("ysm_utils", [
                "ysm_utils.create_default_model",
                "ysm_utils.load_model",
                CACHE_YSM_MODEL_ACTION,
                "_",
                "ysm_utils.add_model_info"
            ]);
            MenuBar.update();
        },
        onunload() {
            delete MenuBar.menues["ysm_utils"];
            MenuBar.update();
            createDefaultModel.delete();
            openModelInfo.delete();
            loadYsmModel.delete();
            removeYsmEvent();
        }
    });
})();
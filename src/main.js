import {loadTLMLanguage} from "./utils/i18nloader";
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
        description: tl("info.ysm_utils.description"),
        icon: "card_membership",
        version: YSM.version,
        variant: "desktop",
        min_version: "4.0.0",
        await_loading: true,
        onload() {
            loadTLMLanguage();
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
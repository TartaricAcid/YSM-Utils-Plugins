import {join} from "path";
import JSON5 from "json5";
import {loadNormalization} from "./load_normalization.js";
import {addToYsmCache} from "../menu/cache_info_menu.js";

export function readYsmFile(packDirectory) {
    let ysmJsonPath = join(packDirectory, "ysm.json");
    let content = fs.readFileSync(ysmJsonPath, "utf8");

    let ysmJson;
    try {
        // 因为 BlockBench 自带的 JSON 解析存在 bug，换用 json5 读取
        ysmJson = JSON5.parse(content);
    } catch (err) {
        console.error(err);
        // 但是 json5 库没法弹窗报错，所以再用 BlockBench 读取一次，弹窗报错
        autoParseJSON(content, true);
        return;
    }

    // 添加进缓存
    addToYsmCache(packDirectory);

    // 数据进行一次标准化
    return loadNormalization(ysmJson);
}
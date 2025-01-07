import {createJimp} from "@jimp/core";
import png from "@jimp/js-png";
import * as resize from "@jimp/plugin-resize";

const MAX_SIZE = 128;

const JIMP = createJimp({
    plugins: [resize.methods],
    formats: [png],
});

export async function resizeImage(filePath) {
    // 先判断文件是否存在
    if (!fs.existsSync(filePath)) {
        return;
    }

    let image = await JIMP.read(filePath);

    // 尝试缩放过大的图片
    if (image.width > MAX_SIZE || image.height > MAX_SIZE) {
        let width = MAX_SIZE;
        let height = MAX_SIZE;
        // 还要考虑到不是 1:1 的情况
        let ratio = image.width / image.height;
        if (ratio > 1) {
            height = MAX_SIZE / ratio;
        } else if (ratio < 1) {
            width = MAX_SIZE * ratio;
        }
        image.resize({w: width, h: height});
    }

    // 所有的图片都读写一遍，剔除冗余数据
    await image.write(filePath);
}
export const SUPPORTED_IMAGE_TYPES = ["png", "avif", "webp", "jpeg", "jpg"];
export const SUPPORTED_IMAGE_NAMES = "png, avif, webp, jpeg, jpg";

export function isSupportImage(pathValue) {
    if (!pathValue || typeof pathValue !== "string") {
        return false;
    }
    let lowerPath = pathValue.toLowerCase();
    for (let type of SUPPORTED_IMAGE_TYPES) {
        if (lowerPath.endsWith("." + type)) {
            return true;
        }
    }
    return false;
}
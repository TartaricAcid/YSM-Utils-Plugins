import {dirname as _dirname} from "path";

/**
 * Create folders recursively
 * @param {String} dirname Folders name
 */
export function mkdirs(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirs(_dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}
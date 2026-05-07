import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import image from "@rollup/plugin-image";
import vue from "rollup-plugin-vue";

function injectVueStyles() {
    return {
        name: "inject-vue-styles",
        transform(code, id) {
            if (!id.includes(".vue?vue&type=style")) {
                return null;
            }
            return {
                code: `
const css = ${JSON.stringify(code)};
if (typeof document !== "undefined" && css) {
    const style = document.createElement("style");
    style.setAttribute("data-plugin", "ysm-utils");
    style.textContent = css;
    document.head.appendChild(style);
}
export default css;
`,
                map: {mappings: ""}
            };
        }
    };
}

export default {
    input: "src/index.js",
    output: {
        file: "ysm-utils.js",
        format: "cjs"
    },
    plugins: [
        vue(),
        injectVueStyles(),
        json(),
        resolve(),
        commonjs(),
        terser({
            mangle: false
        }),
        image()
    ],
    external: ["path"]
};

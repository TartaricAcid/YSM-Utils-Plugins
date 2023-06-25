import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import {terser} from "rollup-plugin-terser";
import image from "@rollup/plugin-image";
import vue from "rollup-plugin-vue";

export default {
    input: "src/main.js",
    output: {
        file: "ysm-utils.js",
        format: "cjs"
    },
    plugins: [
        vue(),
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
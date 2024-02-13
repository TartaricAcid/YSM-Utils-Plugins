const fs = require("fs");

fs.readFile("ysm-utils.js", "utf-8", (error, data) => {
    let out = data.replaceAll("__vue_component__", "__vue_component__ysm")
        .replaceAll("__vue_script__", "__vue_script__ysm")
        .replaceAll("__vue_render__", "__vue_render__ysm")
    fs.writeFile("ysm-utils.js", out, (error) => {
    })
})
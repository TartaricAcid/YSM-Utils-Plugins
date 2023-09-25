import {addToYsmCache} from "./load_cache";

export var loadYsmModel = new Action("ysm_utils.load_model", {
    name: "加载模型",
    icon: "fa-folder-open",
    click: function () {
        let filePaths = electron.dialog.showOpenDialogSync(currentwindow, {
            title: "请选择模型文件夹",
            properties: ["openDirectory"]
        });
        if (!filePaths) {
            return;
        }
        let path = filePaths[0];
        loadYsmFolderModel(path);
    }
});

export var loadYsmFolderModel = function loadFolder(path) {
    if (path && path.length) {
        let mainModelPath = `${path}/main.json`;
        let armModelPath = `${path}/arm.json`;
        if (!fs.existsSync(mainModelPath) || !fs.existsSync(armModelPath)) {
            electron.dialog.showMessageBoxSync(currentwindow, {
                title: "文件夹错误",
                message: "此文件夹内没有主模型文件，第一人称手臂模型文件！\n请检查是否打开了正确的模型文件夹！",
                type: "warning"
            });
            return;
        }
        loadAll(path);
        addToYsmCache(path)
    }
}

function loadAll(path) {
    Blockbench.readFile([`${path}/arm.json`], {readtype: "text"}, files => {
        loadModelFile(files[0]);
        let pathFiles = fs.readdirSync(path);
        let images = [];
        pathFiles.forEach(f => {
            if (f.endsWith(".png")) {
                images.push(`${path}/${f}`);
            }
        })
        Blockbench.readFile(images, {readtype: "image"}, files => {
            files.forEach((f) => new Texture().fromFile(f).add().fillParticle());
            loadMainModel(path)
        });
    });
}

function loadMainModel(path) {
    Blockbench.readFile([`${path}/main.json`], {readtype: "text"}, files => {
        loadModelFile(files[0]);
        let pathFiles = fs.readdirSync(path);
        let images = [];
        pathFiles.forEach(f => {
            if (f.endsWith(".png")) {
                images.push(`${path}/${f}`);
            }
        })
        Blockbench.readFile(images, {readtype: "image"}, files => {
            files.forEach((f) => new Texture().fromFile(f).add().fillParticle());
            loadMainAnimation(path);
        });
    });
}

function loadMainAnimation(path) {
    let animations = [];
    if (fs.existsSync(`${path}/main.animation.json`)) {
        animations.push(`${path}/main.animation.json`);
    }
    if (fs.existsSync(`${path}/arm.animation.json`)) {
        animations.push(`${path}/arm.animation.json`);
    }
    if (fs.existsSync(`${path}/extra.animation.json`)) {
        animations.push(`${path}/extra.animation.json`);
    }
    if (fs.existsSync(`${path}/tac.animation.json`)) {
        animations.push(`${path}/tac.animation.json`);
    }
    Blockbench.readFile(animations, {readtype: "text"}, files => {
        files.forEach(file => Animator.loadFile(file))
    });
}
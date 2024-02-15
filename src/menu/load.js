import {addToYsmCache} from "./load_cache";

export var loadYsmModel = new Action("ysm_utils.load_model", {
    name: "menu.ysm_utils.load_model",
    icon: "fa-folder-open",
    click: function () {
        let filePaths = electron.dialog.showOpenDialogSync(currentwindow, {
            title: tl("menu.ysm_utils.load_model.choose_folder"),
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
                title: tl("menu.ysm_utils.load_model.folder_error.title"),
                message: tl("menu.ysm_utils.load_model.folder_error.desc"),
                type: "warning"
            });
            return;
        }
        loadAll(path);
        addToYsmCache(path)
    }
}

function loadArrowTexture(path) {
    Blockbench.readFile([`${path}/arrow.png`], {readtype: "image"}, files => {
        files.forEach((f) => new Texture().fromFile(f).add().fillParticle());
        if (fs.existsSync(`${path}/arrow.animation.json`)) {
            Blockbench.readFile([`${path}/arrow.animation.json`], {readtype: "text"}, files => {
                files.forEach(file => Animator.loadFile(file))
                loadArmAndMain(path)
            });
        } else {
            loadArmAndMain(path)
        }
    });
}

function loadAll(path) {
    if (fs.existsSync(`${path}/arrow.json`)) {
        Blockbench.readFile([`${path}/arrow.json`], {readtype: "text"}, files => {
            loadModelFile(files[0]);
            if (fs.existsSync(`${path}/arrow.json`)) {
                loadArrowTexture(path);
            } else {
                loadArmAndMain(path)
            }
        });
    } else {
        loadArmAndMain(path)
    }
}

function loadArmAndMain(path) {
    Blockbench.readFile([`${path}/arm.json`], {readtype: "text"}, files => {
        loadModelFile(files[0]);
        let pathFiles = fs.readdirSync(path);
        let images = [];
        pathFiles.forEach(f => {
            if (f.endsWith(".png") && f !== "arrow.png") {
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
            if (f.endsWith(".png") && f !== "arrow.png") {
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
    if (fs.existsSync(`${path}/carryon.animation.json`)) {
        animations.push(`${path}/carryon.animation.json`);
    }
    Blockbench.readFile(animations, {readtype: "text"}, files => {
        files.forEach(file => Animator.loadFile(file))
    });
}
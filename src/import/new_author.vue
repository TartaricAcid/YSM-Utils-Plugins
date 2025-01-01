<script>
import {join} from "path";
import {arePathsEqual} from "../util/path_util.js";

export default {
    props: {
        newAuthorDialog: {
            type: Object,
            required: true
        },
        authors: {
            type: Array,
            required: true
        },
        packDirectory: {
            type: Object,
            required: true
        },
        authorIndex: {
            type: Number,
            required: true
        },
        newAuthor: {
            type: Object,
            default: function () {
                return {
                    "name": "",
                    "avatar": "",
                    "role": "",
                    "contact": {},
                    "comment": ""
                };
            }
        }
    },
    beforeMount() {
        // 初始化值
        if (this.newAuthor["avatar"]) {
            this.avatarImgPath = join(this.packDirectory, this.newAuthor["avatar"]);
        }
    },
    data() {
        return {
            avatarImgPath: ""
        };
    },
    computed: {
        tmpContact: function () {
            let output = [];
            for (let key in this.newAuthor["contact"]) {
                output.push([key, this.newAuthor["contact"][key]]);
            }
            return output;
        },
        isEditAction: function () {
            return this.authorIndex >= 0;
        }
    },
    methods: {
        join, tl,
        deleteAuthor: function () {
            Blockbench.showMessageBox({
                icon: "fa-warning",
                title: tl("level.ysm_utils.warning"),
                message: tl("menu.ysm_utils.import_model_menu.metadata.authors.delete.message"),
                buttons: [tl("dialog.confirm"), tl("dialog.cancel")],
                confirm: 0,
                cancel: 1
            }, (button) => {
                if (button === 0 && this.isEditAction) {
                    this.authors.splice(this.authorIndex, 1);
                    this.newAuthorDialog.close();
                }
            });
        },
        addAuthor: function () {
            // 先检查必填字段有没有
            if (!this.newAuthor["name"]) {
                let tip = tl("menu.ysm_utils.import_model_menu.metadata.authors.need_author_name");
                Blockbench.showQuickMessage(tip, 3000);
                return;
            }

            // 头像文件复制
            let testAvatarImgPath = join(this.packDirectory, this.newAuthor["avatar"]);
            if (this.avatarImgPath && !arePathsEqual(testAvatarImgPath, this.avatarImgPath)) {
                let fileName = pathToName(this.avatarImgPath, true);
                // 复制头像
                let destFolderPath = join(this.packDirectory, "avatar");
                let destPath = join(destFolderPath, fileName);
                // 检查文件夹是否存在
                if (!fs.existsSync(destFolderPath)) {
                    fs.mkdirSync(destFolderPath, {recursive: true});
                }
                // 目的地文件是否存在
                if (fs.existsSync(destPath)) {
                    let button = electron.dialog.showMessageBoxSync({
                        type: "warning",
                        title: tl("level.ysm_utils.warning"),
                        message: tl("menu.ysm_utils.import_model_menu.metadata.authors.same_file"),
                        buttons: [tl("dialog.confirm"), tl("dialog.cancel")]
                    });
                    if (button !== 0) {
                        return;
                    }
                    fs.copyFileSync(this.avatarImgPath, destPath);
                }
                this.newAuthor["avatar"] = `avatar/${fileName}`;
            }

            // 再把联系方式转换成 Object，存起来
            let tmp = {};
            for (let value of this.tmpContact) {
                if (value[0] && value[1]) {
                    tmp[value[0]] = value[1];
                }
            }
            this.newAuthor["contact"] = tmp;

            if (this.isEditAction) {
                // 先删除，再插入，才能重置 vue 界面
                this.authors.splice(this.authorIndex, 1);
                this.authors.splice(this.authorIndex, 0, this.newAuthor);
            } else {
                this.authors.push(this.newAuthor);
            }
            this.newAuthorDialog.close();
        },
        addNewContact: function () {
            this.tmpContact.push(["", ""]);
            this.$forceUpdate();
        },
        deleteContact: function (index) {
            this.tmpContact.splice(index, 1);
            this.$forceUpdate();
        },
        addAvatarImg: function () {
            electron.dialog.showOpenDialog(currentwindow, {
                title: tl("menu.ysm_utils.import_model_menu.metadata.authors.select_author_avatar"),
                filters: [{
                    extensions: ["png"],
                    name: "png",
                }],
                properties: ["openFile"]
            }).then(result => {
                if (result.filePaths[0]) {
                    this.avatarImgPath = result.filePaths[0];
                }
            });
        }
    }
};
</script>

<template>
    <div class="new-author">
        <div class="horizontal-item">
            <div style="width: 40%; margin: 0 auto;">
                <div class="avatar" @click="addAvatarImg">
                    <div v-if="this.avatarImgPath">
                        <img :src="this.avatarImgPath" alt="img" class="img">
                    </div>
                    <div v-else>
                        <i class="fas fa-images fa-9x" style="margin: 20px 8px"></i>
                    </div>
                </div>
            </div>


            <div style="width: 58%">
                <div style="width: 100%; height: 100%">
                    <p class="title">{{ tl("menu.ysm_utils.import_model_menu.metadata.authors.name") }}</p>
                    <p class="desc">{{ tl("menu.ysm_utils.import_model_menu.metadata.authors.name.desc") }}</p>
                    <input class="input" type="text" v-model.trim="newAuthor['name']"
                           :placeholder="tl('menu.ysm_utils.required_fields')">
                </div>


                <div style="width: 100%; height: 100%; margin-top: 10px">
                    <p class="title">{{ tl("menu.ysm_utils.import_model_menu.metadata.authors.role") }}</p>
                    <p class="desc">{{ tl("menu.ysm_utils.import_model_menu.metadata.authors.role.desc") }}</p>
                    <input class="input" type="text" v-model.trim="newAuthor['role']"
                           :placeholder="tl('menu.ysm_utils.can_be_empty')">
                </div>
            </div>
        </div>


        <div class="new-author-item">
            <p class="title">{{ tl("menu.ysm_utils.import_model_menu.metadata.authors.comment") }}</p>
            <p class="desc">{{ tl("menu.ysm_utils.import_model_menu.metadata.authors.comment.desc") }}</p>
            <input class="input" type="text" v-model.trim="newAuthor['comment']"
                   :placeholder="tl('menu.ysm_utils.can_be_empty')">
        </div>


        <div class="new-author-item">
            <p class="title">{{ tl("menu.ysm_utils.import_model_menu.metadata.authors.contact") }}</p>
            <p class="desc">{{ tl("menu.ysm_utils.import_model_menu.metadata.authors.contact.desc") }}</p>

            <div v-for="(value, index) in tmpContact">
                <input class="input-contact-type" type="text" v-model="value[0]">
                <input class="input-contact" type="text" v-model.trim="value[1]">
                <button style="width: 6%; min-width: 5%; padding: 0;" @click="deleteContact(index)">
                    <i class="fas fa-trash-alt" style="margin: 0 auto 3px;"></i>
                </button>
            </div>

            <button style="width: 100%;margin-top: 5px" @click="addNewContact()">
                {{ tl("menu.ysm_utils.import_model_menu.metadata.authors.contact.add") }}
            </button>
        </div>

        <div style="width: 100%; margin-top: 10px">
            <div v-if="isEditAction">
                <button style="width: 48.5%;" @click="deleteAuthor">
                    {{ tl("menu.ysm_utils.import_model_menu.metadata.authors.delete") }}
                </button>
                <button style="width: 48.5%; margin-left: 2%" @click="addAuthor">
                    {{ tl("dialog.confirm") }}
                </button>
            </div>
            <div v-else>
                <button style="width: 100%;" @click="addAuthor">
                    {{ tl("dialog.confirm") }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.new-author {
    width: 100%;
    overflow-y: auto;
    padding: 10px 20px
}

.new-author-item {
    height: 100%;
    width: 100%;
    margin-top: 10px
}

.title {
    margin: 0;
    padding: 0;
    font-size: large
}

.desc {
    margin: 0;
    padding: 0;
    color: #6a6a6d
}

.input {
    border-radius: 1px;
    margin-top: 5px;
    padding: 2px 2px 2px 5px;
    width: 100%;
    height: 30px;
    font-size: 15px;
    background-color: #1c2026;
    border-style: solid;
    border-width: 1px;
    border-color: #181a1f;
}

.input-contact-type {
    border-radius: 1px;
    margin-top: 5px;
    padding: 2px 2px 2px 5px;
    width: 17%;
    height: 30px;
    font-size: 15px;
    background-color: #1c2026;
    border-style: solid;
    border-width: 1px;
    border-color: #181a1f;
}

.input-contact {
    border-radius: 1px;
    margin-top: 5px;
    padding: 2px 2px 2px 5px;
    width: 75%;
    height: 30px;
    font-size: 15px;
    background-color: #1c2026;
    border-style: solid;
    border-width: 1px;
    border-color: #181a1f;
}

.img {
    width: 180px;
    height: 180px;
}

.avatar {
    padding: 10px;
    background-color: #1c2026;
    width: 200px;
    height: 200px;
}

.avatar:hover {
    padding: 10px;
    background-color: #396fd6;
    width: 200px;
    height: 200px;
}

.horizontal-item {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
}
</style>
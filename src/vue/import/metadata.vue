<script>
import {join} from "path";
import {editAuthorDialog, newAuthorDialog} from "../../import/new_author.js";

export default {
    props: {
        importModelMenuDialog: {
            type: Object,
            required: true
        },
        ysmJson: {
            type: Object,
            required: true
        },
        packDirectory: {
            type: Object,
            required: true
        }
    },
    data() {
        return {};
    },
    methods: {
        join,
        tl,
        getTipsRows: function (tips) {
            let size = tips.split("\n").length;
            if (size < 3) {
                return 3;
            }
            return size;
        },
        openNewAuthorDialog: function () {
            newAuthorDialog(this.ysmJson, this.packDirectory);
        },
        editAuthorDialog: function (editAuthor, index) {
            let copyEditAuthor = JSON.parse(JSON.stringify(editAuthor));
            editAuthorDialog(this.ysmJson, this.packDirectory, copyEditAuthor, index);
        }
    },
    computed: {
        metadata: function () {
            return this.ysmJson["metadata"];
        },
        license: function () {
            return this.metadata["license"];
        },
        link: function () {
            return this.metadata["link"];
        }
    }
};
</script>

<template>
    <div class="metadata">
        <div class="metadata-item">
            <p class="title">{{ tl("menu.ysm_utils.load_info_menu.metadata.name") }}</p>
            <p class="desc">{{ tl("menu.ysm_utils.load_info_menu.metadata.name.desc") }}</p>
            <input class="input" type="text" v-model.trim="metadata['name']"
                   :placeholder="tl('menu.ysm_utils.required_fields')">
        </div>


        <div class="metadata-item">
            <p class="title">{{ tl("menu.ysm_utils.load_info_menu.metadata.tips") }}</p>
            <p class="desc">{{ tl("menu.ysm_utils.load_info_menu.metadata.tips.desc") }}</p>
            <textarea class="textarea" :rows="this.getTipsRows(metadata['tips'])"
                      v-model.trim="metadata['tips']" :placeholder="tl('menu.ysm_utils.can_be_empty')">
            </textarea>
        </div>


        <div class="metadata-item">
            <p class="title">{{ tl("menu.ysm_utils.load_info_menu.metadata.license") }}</p>
            <p class="desc">{{ tl("menu.ysm_utils.load_info_menu.metadata.license.desc") }}</p>

            <div class="horizontal-item">
                <p class="horizontal-text">{{ tl("menu.ysm_utils.load_info_menu.metadata.license.type") }}</p>
                <input class="horizontal-input" type="text" v-model.trim="license['type']"
                       :placeholder="tl('menu.ysm_utils.suggest')"/>
            </div>

            <div class="horizontal-item">
                <p class="horizontal-text">{{ tl("menu.ysm_utils.load_info_menu.metadata.license.extra_desc") }}</p>
                <input class="horizontal-input" type="text" v-model.trim="license['desc']"
                       :placeholder="tl('menu.ysm_utils.can_be_empty')"/>
            </div>
        </div>


        <div class="metadata-item">
            <p class="title">{{ tl("menu.ysm_utils.load_info_menu.metadata.authors") }}</p>
            <p class="desc">{{ tl("menu.ysm_utils.load_info_menu.metadata.authors.desc") }}</p>

            <div class="author">
                <div class="author-item" v-for="(author,index) in metadata['authors']">
                    <button class="author-config-button" @click="editAuthorDialog(author, index)">
                        <i class="fa-regular fa-pen-to-square" style="vertical-align: middle"></i>
                        <span>{{ tl("menu.ysm_utils.load_info_menu.metadata.authors.config") }}</span>
                    </button>
                    <div v-if="author['avatar']" class="avatar">
                        <img :src="join(packDirectory, author['avatar'])" alt="avatar" width="76px">
                    </div>
                    <div v-else style="display: flex; align-items: center; height: 90px">
                        <i class="fa-solid fa-image fa-4x" style="margin: 0 auto;"></i>
                    </div>
                    <p class="author-name">{{ author["name"] }}</p>
                    <p class="author-role">{{ author["role"] }}</p>
                    <p class="author-comment">{{ author["comment"] }}</p>
                </div>

                <div class="author-item">
                    <div class="author-add" @click="openNewAuthorDialog">
                        <i class="fa-solid fa-plus fa-4x" style="margin: 0 auto;"></i>
                    </div>
                </div>
            </div>
        </div>


        <div class="metadata-item">
            <p class="title">{{ tl("menu.ysm_utils.load_info_menu.metadata.link") }}</p>
            <p class="desc">{{ tl("menu.ysm_utils.load_info_menu.metadata.link.desc") }}</p>

            <div class="horizontal-item">
                <p class="horizontal-text">{{ tl("menu.ysm_utils.load_info_menu.metadata.link.home") }}</p>
                <input class="horizontal-input" type="url" v-model.trim="link['home']"
                       :placeholder="tl('menu.ysm_utils.suggest')">
            </div>

            <div class="horizontal-item">
                <p class="horizontal-text">{{ tl("menu.ysm_utils.load_info_menu.metadata.link.donate") }}</p>
                <input class="horizontal-input" type="url" v-model.trim="link['donate']"
                       :placeholder="tl('menu.ysm_utils.suggest')">
            </div>
        </div>
    </div>
</template>

<style scoped>
.author {
    display: flex;
    margin-top: 10px;
    flex-wrap: wrap;
}

.author-item {
    width: 135px;
    min-height: 200px;
    text-align: center;
    margin-top: 5px;
    margin-left: 5px;
    padding: 5px;
    background-color: #1e1e22;
    border-style: solid;
    border-width: 1px;
    border-color: #181a1f;
}

.author-name {
    color: #b4b4b4;
    font-size: small;
}

.author-role {
    color: #769f16;
    font-size: small;
}

.author-comment {
    color: #6a6a6d;
    font-size: small;
}

.author-config-button {
    width: 100%;
    margin-bottom: 10px;
}

.author-add {
    width: 100%;
    height: 100%;
    padding: 5px;
    background-color: #272727;
    display: flex;
    align-items: center;
}

.author-add:hover {
    width: 100%;
    height: 100%;
    padding: 5px;
    background-color: #396fd6;
    display: flex;
    align-items: center;
}

.avatar {
    margin: 0 auto;
    background-color: #3e3e3e;
    border-style: solid;
    border-width: 2px;
    border-color: #181a1f;
    width: 80px;
    height: 80px;
}

.metadata {
    width: 100%;
    overflow-y: auto;
    padding: 10px 20px
}

.metadata-item {
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

.horizontal-item {
    display: flex;
}

.horizontal-text {
    width: 12%;
    margin-top: 7px;
    font-size: 15px;
    color: #6a6a6d
}

.horizontal-input {
    flex: 1;
    border-radius: 1px;
    margin-top: 5px;
    padding: 2px 2px 2px 5px;
    height: 30px;
    font-size: 15px;
    background-color: #1c2026;
    border-style: solid;
    border-width: 1px;
    border-color: #181a1f;
}

.textarea {
    border-radius: 1px;
    margin-top: 5px;
    padding: 2px 2px 2px 5px;
    width: 100%;
    font-size: 15px;
    background-color: #1c2026;
    border-style: solid;
    border-width: 1px;
    border-color: #181a1f;
}
</style>
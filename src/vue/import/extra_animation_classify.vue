<script>
import {join} from "path";
import {editExtraAnimationInClassifyDialog} from "../../import/edit_extra_animation_classify.js";

export default {
    props: {
        editExtraAnimationClassifyDialog: {
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
        },
        index: {
            type: Number,
            required: true
        }
    },
    beforeMount() {
    },
    data() {
        return {};
    },
    methods: {
        join,
        tl,
        shouldAddLine: function (index, listSize) {
            // 第一行除去
            if (index === 0) {
                return false;
            }
            // 倒数第二个除去
            if (index === (listSize - 2)) {
                return;
            }
            // 八个为一组，添加横线
            return index % 8 === 6;
        },
        deleteExtraAnimation: function (index) {
            this.tmpExtraAnimation.splice(index, 1);
            this.updateExtraAnimation();
            this.$forceUpdate();
        },
        addNewExtraAnimation: function () {
            this.tmpExtraAnimation.push(["", ""]);
            this.$forceUpdate();
        },
        updateExtraAnimation: function () {
            let tmp = {};
            for (let value of this.tmpExtraAnimation) {
                tmp[value[0]] = value[1];
            }
            this.properties["extra_animation_classify"][this.index]["extra_animation"] = tmp;
        },
        editExtraAnimation: function (index) {
            this.updateExtraAnimation();
            editExtraAnimationInClassifyDialog(this.ysmJson, this.packDirectory, index, this.index);
        },
        onSaveExtraAnimations: function () {
            let tmp = {};
            for (let value of this.tmpExtraAnimation) {
                tmp[value[0]] = value[1];
            }
            this.properties["extra_animation_classify"][this.index]["extra_animation"] = tmp;
            this.editExtraAnimationClassifyDialog.close();
        }
    },
    computed: {
        properties: function () {
            return this.ysmJson["properties"];
        },
        extraAnimations: function () {
            return this.properties["extra_animation_classify"][this.index]["extra_animation"];
        },
        tmpExtraAnimation: function () {
            let output = [];
            for (let key in this.extraAnimations) {
                output.push([key, this.extraAnimations[key]]);
            }
            return output;
        }
    }
};
</script>

<template>
    <div class="properties">
        <div class="all-item">
            <div class="properties-item">
                <p class="title">{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation_classify.id") }}</p>
                <p class="desc">{{
                        tl("menu.ysm_utils.load_info_menu.properties.extra_animation_classify.id.desc")
                    }}</p>
                <input class="input" type="text"
                       v-model.trim='properties["extra_animation_classify"][index]["id"]'
                       :placeholder="tl('menu.ysm_utils.required_fields')">
            </div>

            <div class="properties-item">
                <p class="title">{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation_classify") }}</p>
                <p class="desc">{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation_classify.desc") }}</p>

                <div style="display: flex; flex-wrap: wrap; margin-top: 10px">
                    <div v-for="(value, index) in tmpExtraAnimation"
                         style="width: 49%; margin-left: 2px; margin-top: 2px; overflow: visible;">
                        <input class="input" type="text" style="width: 30%; margin-left: 2px;"
                               v-model.trim="value[0]" disabled>
                        <input class="input" type="text" style="width: 40%; margin-left: 2px;"
                               v-model.trim="value[1]" disabled>
                        <i class="fa-solid fa-pen-to-square extra-delete" @click="editExtraAnimation(index)"></i>
                        <i class="fa-solid fa-trash-can extra-delete" @click="deleteExtraAnimation(index)"></i>

                        <!-- 每 8 个添加一个分隔线 -->
                        <hr v-if="shouldAddLine(index, tmpExtraAnimation.length)"
                            style="width: 192.5%; border-top: 3px dashed #1e1e22;">
                    </div>

                    <button style="width: 44.8%; margin-left: 2px; margin-top: 2px;"
                            @click="addNewExtraAnimation()">
                        <i class="fa-solid fa-plus" style="vertical-align: middle;"></i>
                        <span>{{ tl("menu.ysm_utils.load_info_menu.properties.extra_animation.add") }}</span>
                    </button>
                </div>
            </div>
        </div>

        <div style="margin-top: 20px; margin-bottom: 10px">
            <button style="width: 100%" @click="onSaveExtraAnimations">{{ tl("dialog.confirm") }}</button>
        </div>
    </div>
</template>

<style scoped>
.properties {
    width: 100%;
    overflow-y: auto;
    padding: 10px 20px
}

.properties-item {
    height: 100%;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 20px
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

.horizontal-item {
    height: 100%;
    width: 100%;
    margin-top: 10px;
    display: flex;
    align-items: center;
}

.all-item {
    padding: 20px 30px 20px 30px;
    border-radius: 2px;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(24, 26, 31, 0.5);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3)
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
</style>
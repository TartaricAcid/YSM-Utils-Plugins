<template>
    <div style="margin-left: 0">
        <!-- 模型名称 -->
        <div>
            <p> 模型名称 </p>
            <input placeholder="可以输入任意字符"
                style="margin-top:2px; padding: 3px; width: 98%; height:30px; font-size: 15px; background-color: #1c2026;"
                type="text" v-model.trim="modelName">
        </div>

        <!-- 模型描述 -->
        <div style="margin-top: 5px;">
            <p> 模型描述 </p>
            <textarea placeholder="可以书写多行描述文本"
                style="margin-top:2px; padding: 3px; width: 98%; height:60px; font-size: 15px; background-color: #1c2026;"
                type="text" v-model.trim="modelDesc">
            </textarea>
        </div>

        <!-- 作者 -->
        <div style="margin-top: 5px;">
            <p> 作者 </p>
            <textarea placeholder="每行输入一个作者名称"
                style="margin-top:2px; padding: 3px; width: 98%; height:60px; font-size: 15px; background-color: #1c2026;"
                type="text" v-model.trim="authors">
            </textarea>
        </div>

        <!-- 权限 -->
        <div style="margin-top: 5px;">
            <p> 授权 </p>
            <input placeholder="是否允许二次分发、二次创作等说明"
                style="margin-top:2px; padding: 3px; width: 98%; height:30px; font-size: 15px; background-color: #1c2026;"
                type="text" v-model.trim="license">
        </div>

        <!-- 缩放 -->
        <div style="margin-top: 5px">
            <p>高度缩放</p>
            <div style="display: flex; align-items: center">
                <input max="10" min="0.05" step="0.05" type="range" v-model.number="height_scale" style="width: 82%;">
                <input max="10" min="0.05" step="0.01" type="number" v-model.number="height_scale"
                    style="margin-left:10px; padding: 5px; width: 14%; height:30px; font-size: 15px; background-color: #1c2026;">
            </div>
        </div>

        <div style="margin-top: 5px">
            <p>宽度缩放</p>
            <div style="display: flex; align-items: center">
                <input max="10" min="0.05" step="0.05" type="range" v-model.number="width_scale" style="width: 82%;">
                <input max="10" min="0.05" step="0.01" type="number" v-model.number="width_scale"
                    style="margin-left:10px; padding: 5px; width: 14%; height:30px; font-size: 15px; background-color: #1c2026;">
            </div>
        </div>

        <!-- 额外动画 -->
        <div style="margin-top: 5px;">
            <p> 轮盘动画命名 </p>
            <input placeholder="0"
                style="margin-top:2px; padding: 3px; width: 24%; height:30px; font-size: 15px; background-color: #1c2026;"
                type="text" v-model.trim="names[0]">
            <input placeholder="1"
                style="margin-top:2px; padding: 3px; width: 24%; height:30px; font-size: 15px; background-color: #1c2026;"
                type="text" v-model.trim="names[1]">
            <input placeholder="2"
                style="margin-top:2px; padding: 3px; width: 24%; height:30px; font-size: 15px; background-color: #1c2026;"
                type="text" v-model.trim="names[2]">
            <input placeholder="3"
                style="margin-top:2px; padding: 3px; width: 24%; height:30px; font-size: 15px; background-color: #1c2026;"
                type="text" v-model.trim="names[3]">
            <input placeholder="4"
                style="margin-top:2px; padding: 3px; width: 24%; height:30px; font-size: 15px; background-color: #1c2026;"
                type="text" v-model.trim="names[4]">
            <input placeholder="5"
                style="margin-top:2px; padding: 3px; width: 24%; height:30px; font-size: 15px; background-color: #1c2026;"
                type="text" v-model.trim="names[5]">
            <input placeholder="6"
                style="margin-top:2px; padding: 3px; width: 24%; height:30px; font-size: 15px; background-color: #1c2026;"
                type="text" v-model.trim="names[6]">
            <input placeholder="7"
                style="margin-top:2px; padding: 3px; width: 24%; height:30px; font-size: 15px; background-color: #1c2026;"
                type="text" v-model.trim="names[7]">
        </div>

        <div style="margin-top: 10px">
            <button @click="submit" style="width: 96%; height:30px; border-radius: 1px">确认</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "model_info",
    props: {
        parent: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            modelName: Project['ysm_extra_info']['name'],
            modelDesc: Project['ysm_extra_info']['tips'],
            authors: Project['ysm_extra_info']['authors'],
            license: Project['ysm_extra_info']['license'],
            height_scale: Project['ysm_height_scale'],
            width_scale: Project['ysm_width_scale'],
            names: Project['ysm_extra_info']['extra_animation_names'] ? Project['ysm_extra_info']['extra_animation_names'] : []
        };
    },
    methods: {
        submit: function () {
            Project['ysm_height_scale'] = this.height_scale;
            Project['ysm_width_scale'] = this.width_scale;
            let extraInfo = {}
            let hasData = false;
            if (this.modelName) {
                extraInfo["name"] = this.modelName;
                hasData = true;
            }
            if (this.modelDesc) {
                extraInfo["tips"] = this.modelDesc;
                hasData = true;
            }
            if (this.authors) {
                extraInfo["authors"] = this.authors;
                hasData = true;
            }
            if (this.license) {
                extraInfo["license"] = this.license;
                hasData = true;
            }
            if (this.names && Array.isArray(this.names) && this.names.length > 0) {
                extraInfo["extra_animation_names"] = []
                for (let i = 0; i < 8; i++) {
                    if (this.names[i]) {
                        extraInfo["extra_animation_names"][i] = this.names[i]
                    } else {
                        extraInfo["extra_animation_names"][i] = i + ""
                    }
                }
                hasData = true;
            }
            if (hasData) {
                Project['ysm_extra_info'] = extraInfo;
            }
            this.parent.hide();
        }
    }
};
</script>

<style scoped></style>
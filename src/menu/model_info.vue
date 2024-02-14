<template>
    <div style="margin-left: 0">
        <!-- 模型名称 -->
        <div>
            <p> {{ tl("menu.ysm_utils.model_info.name") }} </p>
            <input :placeholder="tl('menu.ysm_utils.model_info.name.tip')"
                   style="margin-top:2px; padding: 3px; width: 98%; height:30px; font-size: 15px; background-color: #1c2026;"
                   type="text" v-model.trim="modelName">
        </div>

        <!-- 模型描述 -->
        <div style="margin-top: 5px;">
            <p> {{ tl("menu.ysm_utils.model_info.desc") }} </p>
            <textarea :placeholder="tl('menu.ysm_utils.model_info.desc.tip')"
                      style="margin-top:2px; padding: 3px; width: 98%; height:60px; font-size: 15px; background-color: #1c2026;"
                      type="text" v-model.trim="modelDesc">
            </textarea>
        </div>

        <!-- 作者 -->
        <div style="margin-top: 5px;">
            <p> {{ tl("menu.ysm_utils.model_info.author") }} </p>
            <textarea :placeholder="tl('menu.ysm_utils.model_info.author.tip')"
                      style="margin-top:2px; padding: 3px; width: 98%; height:60px; font-size: 15px; background-color: #1c2026;"
                      type="text" v-model.trim="authors">
            </textarea>
        </div>

        <!-- 是否强制免费 -->
        <div style="margin-top: 5px;">
            <div style="display: flex; align-items: center">
                <input class="model-edit-checkbox" type="checkbox" v-model="free">
                <div style="margin-left: 10px">
                    <p class="model-list-edit-item-title">
                        {{ tl("menu.ysm_utils.model_info.free") }}</p>
                    <p class="model-list-edit-item-desc">
                        {{ tl("menu.ysm_utils.model_info.free.tip") }}</p>
                </div>
            </div>
        </div>

        <!-- 权限 -->
        <div style="margin-top: 5px;">
            <p> {{ tl('menu.ysm_utils.model_info.license') }} </p>
            <select v-model="license" :placeholder="tl('menu.ysm_utils.model_info.license.tip')"
                    style="margin-top:2px; padding: 3px; width: 98%; height:30px; font-size: 15px; background-color: #1c2026;">
                <option v-for="option in ysmLicense" v-bind:value="option.value">
                    <p style="margin-right: 40px;">{{ option.value }}</p>丨{{ option.text }}
                </option>
            </select>
        </div>

        <!-- 缩放 -->
        <div style="margin-top: 5px">
            <p>{{ tl("menu.ysm_utils.model_info.height_scale") }}</p>
            <div style="display: flex; align-items: center">
                <input max="10" min="0.05" step="0.05" type="range" v-model.number="height_scale" style="width: 82%;">
                <input max="10" min="0.05" step="0.01" type="number" v-model.number="height_scale"
                       style="margin-left:10px; padding: 5px; width: 14%; height:30px; font-size: 15px; background-color: #1c2026;">
            </div>
        </div>

        <div style="margin-top: 5px">
            <p>{{ tl("menu.ysm_utils.model_info.width_scale") }}</p>
            <div style="display: flex; align-items: center">
                <input max="10" min="0.05" step="0.05" type="range" v-model.number="width_scale" style="width: 82%;">
                <input max="10" min="0.05" step="0.01" type="number" v-model.number="width_scale"
                       style="margin-left:10px; padding: 5px; width: 14%; height:30px; font-size: 15px; background-color: #1c2026;">
            </div>
        </div>

        <!-- 额外动画 -->
        <div style="margin-top: 5px;">
            <p> {{ tl("menu.ysm_utils.model_info.extra_animation_names") }} </p>
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
            <button @click="submit" style="width: 96%; height:30px; border-radius: 1px">
                {{ tl("menu.ysm_utils.model_info.confirm") }}
            </button>
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
            ysmLicense: [
                {text: tl("menu.ysm_utils.model_info.license.cc0"), value: 'CC 0'},
                {text: tl("menu.ysm_utils.model_info.license.mit"), value: 'MIT'},
                {text: tl("menu.ysm_utils.model_info.license.cc_by_sa"), value: 'CC BY-SA 4.0'},
                {text: tl("menu.ysm_utils.model_info.license.cc_by_nc_sa"), value: 'CC BY-NC-SA 4.0'},
                {text: tl("menu.ysm_utils.model_info.license.cc_by_nc_nd"), value: 'CC BY-NC-ND 4.0'},
                {text: tl("menu.ysm_utils.model_info.license.arr"), value: 'All Rights Reserved'},
            ],
            modelName: Project['ysm_extra_info']['name'],
            modelDesc: Project['ysm_extra_info']['tips'],
            authors: Project['ysm_extra_info']['authors'],
            free: Project['ysm_extra_info']['free'],
            license: Project['ysm_extra_info']['license'] ? Project['ysm_extra_info']['license'] : "CC BY-NC-SA 4.0",
            height_scale: Project['ysm_height_scale'],
            width_scale: Project['ysm_width_scale'],
            names: Project['ysm_extra_info']['extra_animation_names'] ? Project['ysm_extra_info']['extra_animation_names'] : []
        };
    },
    methods: {
        tl: tl,
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
                extraInfo["authors"] = this.authors.split('\n');
                hasData = true;
            }
            if (this.free) {
                extraInfo["free"] = this.free;
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
                if (Project.export_path.endsWith("main.json")) {
                    let folder = Project.export_path.substring(0, Project.export_path.length - 10) + "/info.json";
                    let storeInfo = autoStringify(extraInfo);
                    fs.writeFileSync(folder, storeInfo)
                }
            }
            this.parent.hide();
        }
    }
};
</script>

<style scoped></style>
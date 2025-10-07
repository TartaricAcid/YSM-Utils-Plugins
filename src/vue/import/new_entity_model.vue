<script>
const PROJECTILE_ENTITIES = [
    "minecraft:arrow",
    "minecraft:spectral_arrow",
    "minecraft:trident",
    "minecraft:snowball",
    "minecraft:egg",
    "minecraft:splash_potion",
    "minecraft:lingering_potion",
    "minecraft:experience_bottle",
    "minecraft:ender_pearl",
    "minecraft:firework_rocket",
    "minecraft:fishing_bobber",
    "minecraft:wind_charge"
];
const VEHICLE_ENTITIES = [
    "minecraft:boat",
    "minecraft:chest_boat",
    "minecraft:minecart",
    "minecraft:camel",
    "minecraft:donkey",
    "minecraft:horse",
    "minecraft:llama",
    "minecraft:mule",
    "minecraft:pig",
    "minecraft:skeleton_horse",
    "minecraft:strider",
    "minecraft:zombie_horse"
];

export default {
    props: {
        parentMenuDialog: {
            type: Object,
            required: true
        },
        entityModels: {
            type: Object,
            required: true
        },
        type: {
            type: String,
            required: true
        },
    },
    data() {
        return {
            selectedEntityId: "",
            customEntityId: "",
            customEntityIdValid: true,
            useCustomInput: false,
        };
    },
    computed: {
        availableEntities() {
            let all;
            if (this.type === "projectiles") {
                all = PROJECTILE_ENTITIES;
            } else if (this.type === "vehicles") {
                all = VEHICLE_ENTITIES;
            }
            // 过滤掉已存在的实体 ID
            return all.filter(eid => !(eid in this.entityModels));
        }
    },
    methods: {
        tl: tl,
        isResourceLocation(str) {
            return /^[a-z0-9_.\/]+:[a-z0-9_.\/]+$/.test(str);
        },
        validateCustomEntityId() {
            this.customEntityIdValid = this.isResourceLocation(this.customEntityId);
        },
        addEntity() {
            let entityId = this.useCustomInput ? this.customEntityId : this.selectedEntityId;
            if (this.useCustomInput) {
                if (!this.isResourceLocation(entityId)) {
                    this.customEntityIdValid = false;
                    Blockbench.showMessageBox({
                        icon: "fa-warning",
                        title: tl("level.ysm_utils.warning"),
                        message: tl("menu.ysm_utils.add_new_model.entity_id.format_error"),
                        buttons: [tl("dialog.confirm")],
                        confirm: 0
                    });
                    return;
                }
            }
            if (!entityId || entityId in this.entityModels) {
                Blockbench.showMessageBox({
                    icon: "fa-warning",
                    title: tl("level.ysm_utils.warning"),
                    message: tl("menu.ysm_utils.add_new_model.entity_id.exist"),
                    buttons: [tl("dialog.confirm")],
                    confirm: 0
                });
                return;
            }
            this.$set(this.entityModels, entityId, {
                "model": "",
                "texture": {"uv": "", "normal": "", "specular": ""},
                "animation": "",
                "controller": ""
            });
            this.selectedEntityId = "";
            this.customEntityId = "";
            this.customEntityIdValid = true;
            this.useCustomInput = false;
            this.parentMenuDialog.close();
        },
        handleSelectChange(e) {
            if (e.target.value === "__custom__") {
                this.useCustomInput = true;
                this.selectedEntityId = "";
            } else {
                this.useCustomInput = false;
                this.selectedEntityId = e.target.value;
            }
        }
    }
};
</script>

<template>
    <div class="new-entity-model">
        <div style="width: 100%;">
            <label style="width: 40%; font-size: medium">{{ tl("menu.ysm_utils.add_new_model.entity_id") }}</label>
            <select style="width: 40%; font-size: medium; margin-left: 20px"
                    @change="handleSelectChange" :value="useCustomInput ? '__custom__' : selectedEntityId">
                <option value="">
                    {{ tl("menu.ysm_utils.add_new_model.entity_id.select") }}
                </option>
                <option v-for="eid in availableEntities" :key="eid" :value="eid">
                    {{ tl(`ysm.${eid.replaceAll(":", ".")}`) }}
                </option>
                <option value="__custom__" style="color: indianred">
                    {{ tl("menu.ysm_utils.add_new_model.entity_id.custom_input") }}
                </option>
            </select>
        </div>
        <div v-if="useCustomInput" style="width: 100%; margin-top: 10px">
            <div v-if="!customEntityIdValid" style="color:red; font-size: small; margin-top: 5px">
                {{ tl("menu.ysm_utils.add_new_model.entity_id.format_error") }}
            </div>
            <input v-model="customEntityId" @input="validateCustomEntityId" class="input"
                   :placeholder="tl('menu.ysm_utils.add_new_model.entity_id.placeholder')"/>
        </div>
        <button style="width: 100%; margin-top: 50px" @click="addEntity">
            {{ tl("menu.ysm_utils.save") }}
        </button>
    </div>
</template>

<style scoped>
.new-entity-model {
    width: 100%;
    overflow-y: auto;
    padding: 10px 20px
}

.input {
    width: 100%;
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
</style>
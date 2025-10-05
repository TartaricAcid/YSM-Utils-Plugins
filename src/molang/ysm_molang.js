export function addYsmMolang() {
    MolangAutocomplete.DefaultContext.addNamespace(
        new MolangAutocomplete.Namespace({
            id: "ysm",
            shorthand: "ysm",
        })
            .addQuery({
                id: "dump_equipped_item",
                arguments: ["slotType"]
            })
            .addQuery({
                id: "dump_relative_block",
                arguments: ["xOffset", "yOffset", "zOffset"]
            })
            .addQuery({
                id: "dump_mods"
            })
            .addQuery({
                id: "dump_effects"
            })
            .addQuery({
                id: "dump_biome"
            })
            .addQuery({
                id: "mod_version",
                arguments: ["modid"]
            })
            .addQuery({
                id: "equipped_enchantment_level",
                arguments: ["slotType", "id..."]
            })
            .addQuery({
                id: "effect_level",
                arguments: ["id..."]
            })
            .addQuery({
                id: "relative_block_name",
                arguments: ["xOffset", "yOffset", "zOffset"]
            })
            .addQuery({
                id: "head_yaw"
            })
            .addQuery({
                id: "head_pitch"
            })
            .addQuery({
                id: "weather"
            })
            .addQuery({
                id: "dimension_name"
            })
            .addQuery({
                id: "fps"
            })
            .addQuery({
                id: "input_vertical"
            })
            .addQuery({
                id: "input_horizontal"
            })
            .addQuery({
                id: "person_view"
            })
            .addQuery({
                id: "is_passenger"
            })
            .addQuery({
                id: "is_sleep"
            })
            .addQuery({
                id: "is_sneak"
            })
            .addQuery({
                id: "biome_category"
            })
            .addQuery({
                id: "is_open_air"
            })
            .addQuery({
                id: "eye_in_water"
            })
            .addQuery({
                id: "frozen_ticks"
            })
            .addQuery({
                id: "air_supply"
            })
            .addQuery({
                id: "has_helmet"
            })
            .addQuery({
                id: "has_chest_plate"
            })
            .addQuery({
                id: "has_leggings"
            })
            .addQuery({
                id: "has_boots"
            })
            .addQuery({
                id: "has_mainhand"
            })
            .addQuery({
                id: "has_offhand"
            })
            .addQuery({
                id: "has_elytra"
            })
            .addQuery({
                id: "is_riptide"
            })
            .addQuery({
                id: "armor_value"
            })
            .addQuery({
                id: "is_close_eyes"
            })
            .addQuery({
                id: "rendering_in_inventory"
            })
            .addQuery({
                id: "rendering_in_paperdoll"
            })
            .addQuery({
                id: "on_ladder"
            })
            .addQuery({
                id: "ladder_facing"
            })
            .addQuery({
                id: "arrow_count"
            })
            .addQuery({
                id: "stinger_count"
            })
            .addQuery({
                id: "texture_name"
            })
            .addQuery({
                id: "elytra_rot_x"
            })
            .addQuery({
                id: "elytra_rot_y"
            })
            .addQuery({
                id: "elytra_rot_z"
            })
            .addQuery({
                id: "food_level"
            })
            .addQuery({
                id: "first_person_mod_hide"
            })
            .addQuery({
                id: "has_left_shoulder_parrot"
            })
            .addQuery({
                id: "has_right_shoulder_parrot"
            })
            .addQuery({
                id: "left_shoulder_parrot_variant"
            })
            .addQuery({
                id: "right_shoulder_parrot_variant"
            })
            .addQuery({
                id: "attack_damage"
            })
            .addQuery({
                id: "attack_speed"
            })
            .addQuery({
                id: "attack_knockback"
            })
            .addQuery({
                id: "movement_speed"
            })
            .addQuery({
                id: "knockback_resistance"
            })
            .addQuery({
                id: "luck"
            })
            .addQuery({
                id: "block_reach"
            })
            .addQuery({
                id: "entity_reach"
            })
            .addQuery({
                id: "swim_speed"
            })
            .addQuery({
                id: "entity_gravity"
            })
            .addQuery({
                id: "step_height_addition"
            })
            .addQuery({
                id: "nametag_distance"
            })
            .addQuery({
                id: "first_order",
                arguments: ["name", "input", "response"]
            })
            .addQuery({
                id: "second_order",
                arguments: ["name", "input", "frequency", "coefficient", "response"]
            })
            .addQuery({
                id: "bone_rot",
                arguments: ["name"]
            })
            .addQuery({
                id: "bone_pos",
                arguments: ["name"]
            })
            .addQuery({
                id: "bone_scale",
                arguments: ["name"]
            })
            .addQuery({
                id: "bone_pivot_abs",
                arguments: ["name"]
            })
            .addQuery({
                id: "entity_type"
            })
            .addQuery({
                id: "is_player"
            })
            .addQuery({
                id: "is_maid"
            })
            .addQuery({
                id: "particle",
                arguments: ["id", "x", "y", "z", "dx", "dy", "dz", "speed", "count", "life_time"]
            })
            .addQuery({
                id: "abs_particle",
                arguments: ["id", "x", "y", "z", "dx", "dy", "dz", "speed", "count", "life_time"]
            })
            .addQuery({
                id: "mainhand_charged_crossbow"
            })
            .addQuery({
                id: "offhand_charged_crossbow"
            })
            .addQuery({
                id: "is_fishing"
            })
            .addQuery({
                id: "perlin_noise",
                arguments: ["seed", "x", "y", "z"]
            })
            .addQuery({
                id: "on_ground_time"
            })
            .addQuery({
                id: "in_ground"
            })
            .addQuery({
                id: "projectile_owner"
            })
            .addQuery({
                id: "delta_movement_length"
            })
            .addQuery({
                id: "is_spectral_arrow"
            })
            .addQuery({
                id: "shoot_item_id"
            })
            .addQuery({
                id: "relative_block_name_any",
                arguments: ["xOffset", "yOffset", "zOffset", "blockName..."]
            })
            .addQuery({
                id: "ysm.in_shield_block_cooldown"
            })
            .addQuery({
                id: "ysm.xxa"
            })
            .addQuery({
                id: "ysm.yya"
            })
            .addQuery({
                id: "ysm.zza"
            })
            .addQuery({
                id: "ysm.play_sound",
                arguments: ["id", "sound_name", "force_play", "volume", "pitch"]
            })
            .addQuery({
                id: "ysm.stop_sound",
                arguments: ["id"]
            })
            .addQuery({
                id: "ysm.stop_all_sounds"
            })
            .addQuery({
                id: "ysm.block_light"
            })
            .addQuery({
                id: "ysm.sky_light"
            })
            .addQuery({
                id: "ysm.mouse",
                arguments: ["keycode"]
            })
            .addQuery({
                id: "ysm.keyboard",
                arguments: ["keycode..."]
            })
            .addQuery({
                id: "ysm.time_delta"
            })
            .addQuery({
                id: "ysm.sync",
                arguments: ["int..."]
            })
            .addQuery({
                id: "ysm.ground_speed2"
            })
            .addQuery({
                id: "ysm.throwable_item"
            })
            .addQuery({
                id: "ysm.hooked_in"
            })
            .addQuery({
                id: "ysm.is_biting"
            })
            .addQuery({
                id: "ysm.has_any_curios",
                arguments: ["type", "name..."]
            })
            .addQuery({
                id: "ysm.has_any_curios_with_all_tags",
                arguments: ["type", "tag..."]
            })
            .addQuery({
                id: "ysm.has_any_curios_with_any_tag",
                arguments: ["type", "tag..."]
            })
            .addQuery({
                id: "ysm.dump_curios"
            })
    ).addNamespace(
        new MolangAutocomplete.Namespace({
            id: "ctrl",
            shorthand: "ctrl",
        })
            .addQuery({
                id: "death"
            })
            .addQuery({
                id: "riptide"
            })
            .addQuery({
                id: "sleep"
            })
            .addQuery({
                id: "swim"
            })
            .addQuery({
                id: "climb"
            })
            .addQuery({
                id: "climbing"
            })
            .addQuery({
                id: "ladder_up"
            })
            .addQuery({
                id: "ladder_stillness"
            })
            .addQuery({
                id: "ladder_down"
            })
            .addQuery({
                id: "fly"
            })
            .addQuery({
                id: "elytra_fly"
            })
            .addQuery({
                id: "swim_stand"
            })
            .addQuery({
                id: "attacked"
            })
            .addQuery({
                id: "jump"
            })
            .addQuery({
                id: "sneak"
            })
            .addQuery({
                id: "sneaking"
            })
            .addQuery({
                id: "run"
            })
            .addQuery({
                id: "walk"
            })
            .addQuery({
                id: "idle"
            })
            .addQuery({
                id: "hold",
                arguments: ["slotType", "id"]
            })
            .addQuery({
                id: "swing",
                arguments: ["slotType", "id"]
            })
            .addQuery({
                id: "use",
                arguments: ["slotType", "id"]
            })
            .addQuery({
                id: "armor",
                arguments: ["slotType", "id"]
            })
            .addQuery({
                id: "ride",
                arguments: ["type", "id"]
            })
            .addQuery({
                id: "carryon_type"
            })
            .addQuery({
                id: "carryon_is_princess"
            })
            .addQuery({
                id: "parcool_state"
            })
            .addQuery({
                id: "swem_is_ride"
            })
            .addQuery({
                id: "swem_state"
            })
            .addQuery({
                id: "tac_hold_gun"
            })
            .addQuery({
                id: "tac_gun_type"
            })
            .addQuery({
                id: "tac_gun_id"
            })
            .addQuery({
                id: "tac_is_fire"
            })
            .addQuery({
                id: "tac_is_aim"
            })
            .addQuery({
                id: "tac_is_reload"
            })
            .addQuery({
                id: "tac_is_melee"
            })
            .addQuery({
                id: "tac_is_draw"
            })
            .addQuery({
                id: "slashblade_animation"
            })
            .addQuery({
                id: "playing_extra_animation"
            })
            .addQuery({
                id: "create_hanging_skyhook"
            })
    ).addNamespace(
        new MolangAutocomplete.Namespace({
            id: "tlm",
            shorthand: "tlm",
        })
            .addQuery({
                id: "is_begging"
            })
            .addQuery({
                id: "is_sitting"
            })
            .addQuery({
                id: "has_backpack"
            })
            .addQuery({
                id: "favorability_point"
            })
            .addQuery({
                id: "favorability_level"
            })
            .addQuery({
                id: "task_id"
            })
            .addQuery({
                id: "schedule"
            })
            .addQuery({
                id: "activity"
            })
            .addQuery({
                id: "gomoku_win_count"
            })
            .addQuery({
                id: "gomoku_rank"
            })
            .addQuery({
                id: "game_statue"
            })
            .addQuery({
                id: "backpack_type"
            })
            .addQuery({
                id: "is_entity"
            })
            .addQuery({
                id: "is_statue"
            })
            .addQuery({
                id: "is_garage_kit"
            })
            .addQuery({
                id: "show_item"
            })
    );
}
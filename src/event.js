export function registerYsmEvent() {
    Codecs.bedrock.on('parse', parseYsmFile);
    Codecs.bedrock.on('compile', compileYsmFile);
}

export function removeYsmEvent() {
    Codecs.bedrock.events.parsed.remove(parseYsmFile)
    Codecs.bedrock.events.compile.remove(compileYsmFile)
}

function parseYsmFile(data) {
    let description = data['model']['description'];
    if (description) {
        if (description['ysm_height_scale']) {
            Project['ysm_height_scale'] = description['ysm_height_scale']
        } else {
            Project['ysm_height_scale'] = 0.7;
        }
        if (description['ysm_width_scale']) {
            Project['ysm_width_scale'] = description['ysm_width_scale']
        } else {
            Project['ysm_width_scale'] = 0.7;
        }
        if (description['ysm_extra_info']) {
            Project['ysm_extra_info'] = description['ysm_extra_info']
            let extraInfo = Project['ysm_extra_info'];
            if (!extraInfo["name"]) {
                extraInfo["name"] = "";
            }
            if (!extraInfo["tips"]) {
                extraInfo["tips"] = "";
            }
            if (!extraInfo["authors"]) {
                extraInfo["authors"] = "";
            } else {
                extraInfo["authors"] = extraInfo["authors"].join("\n");
            }
            if (!extraInfo["license"]) {
                extraInfo["license"] = "";
            }
            if (!extraInfo["extra_animation_names"]) {
                extraInfo["extra_animation_names"] = [];
            }
        } else {
            Project['ysm_extra_info'] = {
                "name": "",
                "tips": "",
                "authors": "",
                "license": "",
                "extra_animation_names": []
            }
        }
    }
}

function compileYsmFile(data) {
    let description = data['model']['minecraft:geometry'][0]['description'];
    if (description) {
        if (Project['ysm_height_scale'] && Project['ysm_height_scale'] !== 0.7) {
            description['ysm_height_scale'] = Project['ysm_height_scale']
        }
        if (Project['ysm_width_scale'] && Project['ysm_width_scale'] !== 0.7) {
            description['ysm_width_scale'] = Project['ysm_width_scale']
        }
        if (Project['ysm_extra_info']) {
            let extraInfo = Project['ysm_extra_info']
            let extraInfoOut = {}
            let hasData = false;
            if (extraInfo["name"]) {
                extraInfoOut["name"] = extraInfo["name"];
                hasData = true;
            }
            if (extraInfo["tips"]) {
                extraInfoOut["tips"] = extraInfo["tips"];
                hasData = true;
            }
            if (extraInfo["authors"]) {
                extraInfoOut["authors"] = extraInfo["authors"].split('\n');
                hasData = true;
            }
            if (extraInfo["license"]) {
                extraInfoOut["license"] = extraInfo["license"];
                hasData = true;
            }
            if (extraInfo["extra_animation_names"] && Array.isArray(extraInfo["extra_animation_names"]) && extraInfo["extra_animation_names"].length > 0) {
                extraInfoOut["extra_animation_names"] = extraInfo["extra_animation_names"];
                hasData = true;
            }
            if (hasData) {
                description['ysm_extra_info'] = extraInfoOut
            }
        }
    }
}
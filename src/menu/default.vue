<template>
  <div>
    <h1 style="text-align: center">请选择创建类型</h1>
    <ul style="display: grid; max-height: 465px; padding: 5px; overflow-y: auto; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); grid-gap: 5px;">
      <li :style="{'background-color': '#17191d', 'cursor': 'pointer', 'text-align': 'center'}">
        <button @click="createFemaleWorkspace" style="width: 100%; height: 100%">
          <img :src="imgFemale" alt="" width="100px" style="margin-top: 15px">
          <h2 style="margin: 10px">女性默认模型</h2>
        </button>
      </li>
      <li :style="{'background-color': '#17191d', 'cursor': 'pointer', 'text-align': 'center'}">
        <button @click="createMaleWorkspace" style="width: 100%; height: 100%">
          <img :src="imgMale" alt="" width="100px" style="margin-top: 15px">
          <h2 style="margin: 10px">男性默认模型</h2>
        </button>
      </li>
      <li :style="{'background-color': '#17191d', 'cursor': 'pointer', 'text-align': 'center'}">
        <button @click="createEmptyWorkspace" style="width: 100%; height: 100%">
          <img :src="imgEmpty" alt="" width="100px" style="margin-top: 15px">
          <h2 style="margin: 10px">空白工作区</h2>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import FEMALE_IMG from "../assets/img/female.png";
import MALE_IMG from "../assets/img/male.png";
import EMPTY_IMG from "../assets/img/empty.png";
import {createDefaultModel} from "./default";

export default {
  name: "maid_model_choose",
  data() {
    return {
      imgFemale: FEMALE_IMG,
      imgMale: MALE_IMG,
      imgEmpty: EMPTY_IMG
    };
  },
  methods: {
    tl: tl,
    createFemaleWorkspace: function () {
      createDefaultModel.hide();
      newProject(Formats["bedrock"]);
    },
    createMaleWorkspace: function () {
      createDefaultModel.hide();
    },
    createEmptyWorkspace: function () {
      createDefaultModel.hide();
    }
  }
};
</script>

<style scoped>
</style>
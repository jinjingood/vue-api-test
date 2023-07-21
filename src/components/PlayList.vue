<template>
  <div class="songlist-bg">
    <div v-for="item in songlist" :key="item" class="songlist-box">
      <div class="songlist-item" @click="PlayThisSong">{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";

export default {
  name: "PlayList",
  props: ["songlist"],
  setup(props) {
    const state = reactive({
      songlist: props.songlist,
    });
    // onMounted(async () => {

    // });
    return { ...toRefs(state) };
  },
};
</script>

<style lang="less" scoped>
.songlist-bg {
//   position: sticky;
//   margin-top: 0;
position: fixed;
  height: 100%;
  border-radius: 30px 30px 0 0;
  background-color: #fff;
  overflow: hidden;
  //   box-shadow: 0 40px 40px 40px #00000060;
  .songlist-box {
    padding: 0 16px;
    .songlist-item {
      padding: 16px 0;
      text-align: left;
      border-bottom: 1px solid #eeeeee;
    }
  }
}
</style>

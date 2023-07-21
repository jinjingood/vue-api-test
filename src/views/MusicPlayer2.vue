<template>
  <a-carousel class="banner-box">
    <div v-for="image in images" :key="image" class="banner-item">
      <img :src="image.pic" class="banner-img" />
    </div>
  </a-carousel>
  <HomeList></HomeList>
  <!-- <player></player> -->
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { useStore } from "vuex";
import { getBanner } from "@/requests/api/home.js";
import HomeList from "@/components/HomeList.vue";

export default {
  components: { HomeList },
  setup() {
    const store = useStore();
    const state = reactive({
      images: [],
    });
    onMounted(async () => {
      //不封装域名和获取banner的api话，就需要这样手动写
      // axios.get("http://localhost:3000/banner?type=2").then((res) => {
      //   console.log("res:" + JSON.stringify(res));
      //   state.images = res.data.banners;
      //   console.log("state.images:" + state.images);
      // });

      //封装后，可以集中去requests文件夹修改域名和api接口，更方便
      let res = await getBanner();
      state.images = res.data.banners;
      //但是因为是异步请求，所以要写async和await
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less" scoped>
.banner-box {
  margin: 0 50px;
  :deep(.slick-slide) {
    text-align: center;
    // height: 160px;//官方写的这2行会导致img不自适应填充
    // line-height: 160px;
    background: #364d79;
    overflow: hidden;
    border-radius: 20px;
  }
  :deep(.slick-slide h3) {
    color: #fff;
  }
  .banner-img {
    height: 100%; //要想自适应填充得写这3行
    width: 100%;
    object-fit: cover;
  }
}
</style>

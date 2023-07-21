<template>
  <div class="box">
    <h2 style="text-align: left">发现好歌</h2>
    <div class="list-box">
      <div class="list-container">
        <div
          class="list-item"
          v-for="item in Personalizedlist"
          @click="toplaylist"
        >
          <router-link :to="{ path: '/MusicItem', query: { id: item.id } }">
            <img class="list-item-img" :src="item.picUrl" />
            <div class="list-item-img-mask">
              <p>{{ Count(item.playCount) }}</p>
              <p>{{ item.name }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import { getPersonalized } from "@/requests/api/home.js";

export default {
  name: "HomeList",
  props: {},
  setup() {
    const state = reactive({
      Personalizedlist: [],
    });
    onMounted(async () => {  
      let res = await getPersonalized();
      state.Personalizedlist = res.data.result;
      // console.log("每日推荐：" + JSON.stringify(res));
    });
    function Count(num) {
      if (num >= 100000000) {
        return (num / 100000000).toFixed(2) + "亿";
      } else if (num >= 10000) {
        return (num / 10000).toFixed(2) + "万";
      } else {
        return num;
      }
    }
    return {
      ...toRefs(state),
      Count,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.box {
  margin: 20px 50px;
}
.list-box {
  position: absolute;
  overflow: hidden;
  height: 100%;
  width: 100%;
  overflow-x: scroll;
  .list-container {
    position: absolute;
    display: flex;
    height: 180px;
    padding-right: 100px;
    .list-item {
      width: 180px;
      margin-right: 16px;
      .list-item-img {
        border-radius: 20px;
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
      .list-item-img-mask {
        position: absolute;
        bottom: 0;
        height: 100%;
        width: 180px;
        background: linear-gradient(
          to top,
          rgba(0, 0, 0),
          rgba(0, 0, 0, 0) 50%,
          rgba(0, 0, 0, 0),
          rgba(0, 0, 0, 0.5) 100%
        );
        border-radius: 20px;
        > p {
          position: absolute;
          width: 180px;
          margin: 0;
          padding: 10px;
          color: white;
        }
        > p:first-child {
          text-align: right;
          top: 0;
        }
        > p:last-child {
          bottom: 0;
          font-size: 15px;
          font-weight: 500;
          text-align: left;
          word-wrap: break-word;
        }
      }
    }
  }
}
</style>

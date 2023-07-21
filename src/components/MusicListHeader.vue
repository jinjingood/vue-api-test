<template>
  <div class="header-box">
    <div class="top-nev"><span class="back"></span></div>
    <div class="cover-img-box">
      <img :src="playlist.coverImgUrl" class="cover-img" />
    </div>
    <div class="headerinfor-box">
      <a-row :gutter="16">
        <a-col :span="8" class="list-img-box">
          <img :src="playlist.coverImgUrl" class="list-img" />
          <span class="subscribedCount"
            >{{ Count(playlist.subscribedCount) }}订阅</span
          >
        </a-col>
        <a-col :span="16" class="list-infors">
          <h3 class="name">{{ playlist.name }}</h3>
          <div class="avatar">
            <div class="avatar-img">
              <img :src="playlist.creator?.avatarUrl" />
            </div>
            {{ playlist.creator?.nickname }}
          </div>

          <p class="description">{{ playlist.description }}</p>
        </a-col>
      </a-row>
    </div>
    <!-- <div class="list-box"> -->
    <!-- <div> -->
    <!-- <div v-for="item in playlist" :key="item"> -->
    <!-- <p class="muisc-name">muisc-name</p> -->
    <!-- <span class="muisc-author">muisc-author</span> -->
    <!-- </div> -->
    <!-- </div> -->
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import { getPlaylist } from "@/requests/api/home";
import { useRoute } from "vue-router"; //写这个才能把<router-link>携带的参数接受到
import leftOutlined from "ant-design-vue";

export default {
  name: "MusicListHeader",
  components: { leftOutlined },
  props: ["playlist"],
  setup(props) {
    const state = reactive({
      playlist: props.playlist,
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

<style lang="less" scoped>
.header-box {
  // position: relative;
  // height: 260px;
  overflow: hidden;
  .top-nev {
    display: flex;
    width: 100%;
    z-index: 3;
    padding: 24px 16px 0 16px;
    .back {
      display: inline-block;
      width: 10px;
      height: 2px;
      border-radius: 2px;
      background: rgb(33, 33, 33);
      transform: rotate(45deg);
    }
    .back::after {
      content: "";
      display: block;
      width: 10px;
      height: 2px;
      margin: -4.5px;
      border-radius: 2px;
      background: rgb(33, 33, 33);
      transform: rotate(-90deg);
    }
  }
  .cover-img-box {
    position: absolute;
    .cover-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: blur(30px);
      z-index: 0;
    }
  }
  .headerinfor-box {
    position: absolute;
    padding: 16px;
    .list-img-box {
      text-align: left;
      .list-img {
        height: 100px;
        margin-top: 4px;
        margin-bottom: 16px;
        border-radius: 8px;
      }
      .subscribedCount {
        font-size: 12px;
        color: aliceblue;
      }
    }
    .list-infors {
      text-align: left;
      color: aliceblue;
      .name {
        font-size: 18px;
        font-weight: 600;
        color: white;
        text-align: justify; //2端对齐
      }
      .avatar {
        text-align: left;
        margin: 16px 0;
        width: 100%;
        .avatar-img {
          display: inline-block;
          height: 24px;
          width: 24px;

          > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 20px;
          }
        }
      }
      .description {
        font-size: 12px;
        text-align: justify;
      }
    }
  }
}
</style>

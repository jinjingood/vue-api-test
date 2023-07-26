<template>
  <div class="header-box">
    <div class="cover-img-box">
      <img :src="playlist.coverImgUrl" class="cover-img" />
    </div>
    <div class="headerinfor-box">
      <a-row :gutter="16">
        <a-col :span="7" class="list-img-box">
          <img :src="playlist.coverImgUrl" class="list-img" />
        </a-col>
        <a-col :span="17" class="list-infors">
          <h3 class="name">{{ playlist.name }}</h3>

          <div class="basicinfor">
            <div class="avatar">
              <div class="avatar-img">
                <img :src="playlist.creator?.avatarUrl" />
              </div>
              {{ playlist.creator?.nickname }}
            </div>
            <span class="subscribedCount"
              >{{ Count(playlist.subscribedCount) }}订阅</span
            >
          </div>

          <p class="description">{{ playlist.description }}</p>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";

export default {
  name: "MusicListHeader",
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
  padding-top: 50px;
  overflow: hidden;
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
    padding: 0 16px;
    .list-img-box {
      text-align: center;

      .list-img {
        height: 100px;
        margin-top: 4px;
        margin-bottom: 16px;
        border-radius: 8px;
        box-shadow: 0 0 10px 5px #00000020;
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
      .basicinfor {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin: 16px 0;
        .avatar {
          text-align: left;
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
        .subscribedCount {
          width: 100%;
          font-size: 12px;
          color: aliceblue;
          text-align: right;
          line-height: 24px;
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

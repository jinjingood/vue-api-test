<template>
  <div class="bg-box">
    <img class="bg-img" :src="songdetail.al?.picUrl" />
  </div>
  <div class="top-box" @click="closeSongDetail">
    <h4>{{ songdetail.al?.name }}</h4>
    <span class="close"></span>
  </div>
  <div class="song-infor-box">
    <div
      :class="{ 'img-running-box': playing, 'img-stop-box': !playing }"
      @click="changeplaying"
    >
      <img class="song-img" :src="songdetail.al?.picUrl" />
    </div>
  </div>
  <div class="lyrics-box">
    <div v-for="(item, index) in lyricArr" :key="index">
      <span
        :class="{ 'now-lyric': isnowtime, 'normal-lyric': !isnowtime }"
        ref="lyrictime"
        >{{ item.lrc }}</span
      >
    </div>
  </div>
</template>
<script>
import { onMounted, reactive, toRefs, computed, watch } from "vue";
import { useStore } from "vuex";
import { getLyrics } from "@/requests/api/home";

export default {
  name: "SongDetail",
  props: ["songdetail", "open"],
  emits: ["closeSongDetail"],
  setup(props, context) {
    const store = useStore();
    const state = reactive({
      songdetail: props.songdetail,
      lyrics: {},
      lyricArr: [],
      playing: store.state.playing,
      nowtime: 0,
      currenttime: store.state.CurrentTime,
      isnowtime: false,
    });
    watch([() => props.songdetail, store.state.playing], () => {
      state.songdetail = props.songdetail;
      state.playing = store.state.playing;
    });

    watch(
      () => store.state.CurrentTime,
      () => {
        state.currenttime = store.state.CurrentTime;
        console.log("歌曲详情页打印时间：" + store.state.CurrentTime);
        // console.log("state.currettime：" + state.currenttime);
      }
    );

    state.isnowtime = () => {
      // state.lyricArr.forEach((item,i)=>{
      //   if (
      //     state.currenttime >= item.Sectime &&
      //     state.currenttime <= state.lyricArr[i + 1].Sectime
      //   ) {
      //     console.log("时间对上了:" + state.lyricArr[i].Sectime);
      //     return true;
      //   }
      // })
      for (let i = 0; i < state.lyricArr.length; i++) {
        if (
          state.currenttime >= state.lyricArr[i].Sectime &&
          state.currenttime <= state.lyricArr[i + 1].Sectime
        ) {
          console.log("时间对上了:" + state.lyricArr[i].Sectime);
          return true;
        }
      }
      return true;
    };

    state.lyricArr = computed(() => {
      const arr = state.lyrics.lrc?.lyric
        .split(/[(\r\n)\r\n]+/)
        .map((item, i) => {
          let min = item.slice(1, 3);
          let sec = item.slice(4, 6);
          let mill = item.slice(7, 10);
          let lrc = item.slice(11, item.length);
          if (isNaN(Number(mill))) {
            mill = item.slice(7, 9);
            lrc = item.slice(10, item.length);
          }
          let Sectime = parseInt(min) * 60 + parseInt(sec) + parseInt(mill);
          return { Sectime, lrc };
        });
      return arr;
    });

    const closeSongDetail = () => {
      // props.open = false;
      context.emit("closeSongDetail", false);
    };

    const changeplaying = () => {
      if (!state.playing) {
        state.playing = true;
        store.commit("updatePlaying", true);
        // context.emit("changeplaying", true);
      } else {
        state.playing = false;
        store.commit("updatePlaying", false);
        // context.emit("changeplaying", false);
      }
      console.log("点击了碟片，store的playing是：" + store.state.playing);
    };

    onMounted(async () => {
      //获取歌词
      let res = await getLyrics(state.songdetail.id);
      state.lyrics = res.data;
      // console.log("歌词是：" + JSON.stringify(state.lyrics));
    });
    return {
      ...toRefs(state),
      closeSongDetail,
      changeplaying,
      // isnowtime,
    };
  },
};
</script>
<style lang="less" scoped>
.bg-box {
  position: absolute;
  overflow: hidden;
  border-radius: 20px;
  z-index: -1;
  height: 100%;
  .bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(50px);
  }
}
.top-box {
  // position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 20px 0;
  padding: 8px 16px;
  height: 20px;
  > h4 {
    width: 90%;
    margin: 0;
    line-height: 20px;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .close {
    display: inline-block;
    width: 16px;
    height: 2px;
    border-radius: 2px;
    background: rgb(33, 33, 33);
    transform: rotate(45deg);
  }
  .close::after {
    content: "";
    display: block;
    width: 16px;
    height: 2px;
    border-radius: 2px;
    background: rgb(33, 33, 33);
    transform: rotate(-90deg);
  }
}
.song-infor-box {
  margin-top: 100px;
  .img-running-box,
  .img-stop-box {
    width: calc(100% - 100px);
    margin: 50px;
    border: 70px solid #000;
    border-radius: 50%;
    .song-img {
      width: 100%;
      height: 100%;
      object-fit: fill;
      border-radius: 50%;
    }
  }
  .img-running {
    animation: spin 20s linear infinite;
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
}
.lyrics-box {
  height: calc(100% - 800px);
  padding: 0 30px;
  overflow-y: scroll;
  .normal-lyric {
    font-size: 16px;
    color: #ffffff60;
    line-height: 56px;
    word-break: break-all;
  }
  .now-lyric {
    font-size: 18px;
    color: aquamarine;
    line-height: 64px;
  }
}
</style>

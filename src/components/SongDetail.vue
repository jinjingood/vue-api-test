<template>
  <div class="bg-box">
    <img class="bg-img" :src="songdetail.al?.picUrl" />
  </div>
  <div class="top-box" @click="closeSongDetail">
    <h4>{{ songdetail.al?.name }}</h4>
    <span class="close"></span>
  </div>
  <div class="song-infor-box">
    <div :class="{ 'img-running-box': playing, 'img-stop-box': !playing }">
      <img class="song-img" :src="songdetail.al?.picUrl" />
    </div>
  </div>
  <div class="lyrics-box" ref="lyricbox">
    <p
      v-for="(item, index) in lyricArr"
      :key="index"
      :class="{
        'now-lyric': isnowtime(item, index),
        'normal-lyric': !isnowtime(item, index),
      }"
    >
      {{ item.lrc }}
    </p>
  </div>
  <div class="controplayer-box">
    <div class="player-rihgt">
      <div class="play-btn" @click="changeplaying">
        <div v-if="!playing" class="stoped"></div>
        <div v-else class="playing"></div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  onMounted,
  reactive,
  toRefs,
  computed,
  watch,
  ref,
  watchEffect,
} from "vue";
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
      lyrics: [],
      lyricArr: [],
      playing: store.state.playing,
      nowtime: 0,
      currenttime: store.state.CurrentTime,
    });
    watch(
      [() => props.songdetail, store.state.playing],
      [
        () => {
          state.songdetail = props.songdetail;
        },
        () => {
          state.playing = store.state.playing;
        },
        console.log("歌词页监听到playing变化了吗？:" + state.playing),
      ]
    );

    let lyricbox = ref();
    watch(
      //监听播放器的时间变化
      () => store.state.CurrentTime,

      () => {
        state.currenttime = store.state.CurrentTime;
      },
      () => {
        const nowlyric = document.querySelector("p.now-lyric");
        if (nowlyric && nowlyric.offsetTop > 660) {
          lyricbox.value.scrollTop = nowlyric.offsetTop - 660;
          // console.log([lyricbox.value]);
          // console.log([nowlyric]);
        }
      },
      () => {
        state.songdetail = props.songdetail;
      },
      () => {
        state.playing = store.state.playing;
      }
    );

    state.lyricArr = computed(() => {
      const arr = state.lyrics.lrc?.lyric
        .split(/[(\r\n)\r\n]+/)
        .map((item, i) => {
          let min = item.slice(1, 3);
          let sec = item.slice(4, 6);
          // let mill = item.slice(7, 10);
          // let lrc = item.slice(11, item.length);
          let mill = item.slice(7, 9);
          let lrc = item.slice(10, item.length);
          let Sectime = parseInt(min) * 60 + parseInt(sec);
          // if (isNaN(Number(mill))) {
          //   mill = item.slice(7, 9);
          //   lrc = item.slice(10, item.length);
          // }
          return { Sectime, lrc };
        });
      return arr;
    });

    const isnowtime = (item, index) => {
      if (
        index + 1 !== state.lyricArr.length &&
        item.Sectime <= state.currenttime &&
        state.lyricArr[index + 1].Sectime >= state.currenttime
      ) {
        {
          // console.log("播放器时间state.currenttime:" + state.currenttime);
          // console.log("item.Sectime:" + item.Sectime);
          return true;
        }
      } else if (index + 1 === state.lyricArr.length) {
        return true;
      }
    };

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
      console.log("歌词是：" + JSON.stringify(state.lyrics.lrc?.lyric));
    });
    return {
      ...toRefs(state),
      closeSongDetail,
      changeplaying,
      isnowtime,
      lyricbox,
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
  .img-running-box {
    animation: spin 10s linear infinite;
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
  scroll-behavior: smooth;
  transition-property: scroll-behavior;
  transition: all 0.5s ease-out;

  .normal-lyric {
    font-size: 14px;
    color: #ffffff80;
    line-height: 30px;
    word-break: break-all;
    // height: 30px;
  }
  .now-lyric {
    font-size: 20px;
    font-weight: 500;
    // height: 60px;
    color: aquamarine;
    line-height: 30px;
    word-break: break-all;
  }
}
.player-rihgt {
  display: inline-flex;
  .play-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
    width: 80px;
    margin: auto;
    // background-color: #ffffff20;
    border: 2px solid #ffffff;
    border-radius: 100px;

    .playing {
      width: 0;
      height: 0;
      border: 18px solid transparent;
      border-left: 30px solid white;
      margin-left: 26px;
      border-radius: 4px;
      transform: rotate(360deg);
    }
    .stoped {
      height: 36px;
      width: 30px;
      border: none;
      border-left: 10px solid #ffffff;
      border-right: 10px solid #ffffff;
      border-radius: 2px;
      // background: white;
    }
  }
}
</style>

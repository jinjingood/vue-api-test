<template>
  <div class="bg-box">
    <img class="bg-img" :src="songdetail.al?.picUrl" />
  </div>
  <div class="top-box" @click="closeSongDetail">
    <h4>{{ songdetail.al?.name }}</h4>
    <div class="close"></div>
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
    <a-slider
      v-model:value="currenttime"
      :max="songdetail.dt"
      :step="0.1"
      @change="changeSildeTime(value)"
    />
    <div class="time-box">
      <span class="currenttime">{{ formmatcurrentime }}</span>
      <span class="duration">{{ duration }}</span>
    </div>
    <div class="player-box">
      <div class="changesong-btn" @click="changesong(-1)">
        <div class="pre-icon">上一首</div>
      </div>
      <div class="play-btn" @click="changeplaying">
        <div v-if="!playing" class="stoped"></div>
        <div v-else class="playing"></div>
      </div>
      <div class="changesong-btn" @click="changesong(1)">
        <div class="next-icon">下一首</div>
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
  props: ["songdetail", "open", "songlist"],
  emits: ["closeSongDetail", "changeSongDetail"],
  setup(props, context) {
    const store = useStore();
    const state = reactive({
      songdetail: props.songdetail,
      lyrics: [],
      lyricArr: [],
      playing: store.state.playing,
      currenttime: store.state.CurrentTime,
      duration: "",
      formmatcurrentime: "",
    });

    onMounted(async () => {
      //获取歌词
      let res = await getLyrics(state.songdetail.id);
      state.lyrics = res.data;
      // console.log("歌词是：" + JSON.stringify(state.lyrics.lrc?.lyric));
    });

    watchEffect(
      [() => store.state.playing],
      [
        () => {
          state.songdetail = props.songdetail;
        },
        () => {
          state.playing = store.state.playing;
        },
        async () => {
          //不写这个，歌词就不会同时切换，因为歌词实在onMounted加载的，要在监听里再调用一次api
          let res = await getLyrics(state.songdetail.id);
          state.lyrics = res.data;
          console.log("歌词切换了");
        },
      ],
      { deep: true, immediate: true }
    );

    let lyricbox = ref(); //监听播放器的时间变化
    watch(
      //不能用watcheffect，会无法触发监听，时间轴不会更新
      [
        () => store.state.CurrentTime,
        () => props.songdetail,
        () => store.state.playing,
      ],

      //必须包在[]里才有效果，不然好像只执行第一个函数
      [
        () => {
          state.currenttime = store.state.CurrentTime;
          state.songdetail = props.songdetail;
          state.playing = store.state.playing;
        },
        () => {
          const nowlyric = document.querySelector("p.now-lyric");
          if (nowlyric && nowlyric.offsetTop > 500) {
            lyricbox.value.scrollTop = nowlyric.offsetTop - 580;
            // console.log([lyricbox.value]);
            // console.log([nowlyric]);
          }
        },
      ],
      { deep: true, immediate: true }
    );

    state.duration = computed(
      () => {
        //不要用computed会报错
        let value = state.songdetail.dt;
        const min = (value / 60000).toFixed(0);
        const sec = ((value % 60000) / 1000).toFixed(0);
        //不加number好像就不是数字，无法跟10做比较
        if (min < 10 && sec >= 10) {
          let time = "0" + min + " : " + sec;
          return time;
        } else if (min >= 10 && sec < 10) {
          let time = min + " : " + "0" + sec;
          return time;
        } else if (min < 10 && sec < 10) {
          let time = "0" + min + " : " + "0" + sec;
          return time;
        } else {
          let time = min + " : " + sec;
          return time;
        }
      },
      { deep: true, immediate: true }
    );

    state.formmatcurrentime = computed(
      () => {
        //不要用computed会报错
        let value = store.state.CurrentTime;
        const min = (value / 60000).toFixed(0);
        const sec = ((value % 60000) / 1000).toFixed(0);
        //不加number好像就不是数字，无法跟10做比较
        if (Number(min) < 10 && Number(sec) >= 10) {
          let time = "0" + min + " : " + sec;
          return time;
        } else if (Number(min) >= 10 && Number(sec) < 10) {
          let time = min + " : " + "0" + sec;
          return time;
        } else if (Number(min) < 10 && Number(sec) < 10) {
          let time = "0" + min + " : " + "0" + sec;
          return time;
        } else {
          let time = min + " : " + sec;
          return time;
        }
      },
      { deep: true, immediate: true }
    );

    //提取每一行的歌词和秒数
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
        item.Sectime <= state.currenttime &&
        state.lyricArr[index + 1].Sectime >= state.currenttime
      ) {
        // console.log("播放器时间state.currenttime:" + state.currenttime);
        // console.log("item.Sectime:" + item.Sectime);
        return true;
      }
    };

    const changesong = (value) => {
      let num = store.state.Index + value;
      if (num < 0) {
        num = store.state.Playersongs.length - 1;
        // num = 0;不能把0号歌曲的上一首设为0，可能是因为切换播放的时候需要监听序号，此时序号还设为0的话，就没有触发索引更新，所以报错
      } else if (num === store.state.Playersongs.length) {
        num = 0;
      }
      store.commit("updateIndex", num);
      state.currenttime = 0; //先更新时间轴到0
      store.commit("updateTime", 0); //把0传给store中的currentTime，使其重新传值给时间轴，否则时间轴不移动
      context.emit("changeSongDetail", num); //把索引号传给父组件
      console.log("切歌了：" + JSON.stringify(state.songdetail));
    };

    const closeSongDetail = () => {
      context.emit("closeSongDetail", false);
    };

    const changeplaying = () => {
      if (!state.playing) {
        state.playing = true;
        store.commit("updatePlaying", true);
      } else {
        state.playing = false;
        store.commit("updatePlaying", false);
      }
    };

    const changeSildeTime = (value) => {
      state.currenttime = value;
      store.commit("updateTime", value);
      store.commit("updatePlaying", true);
      // state.playing = true;
    };

    return {
      ...toRefs(state),
      closeSongDetail,
      changeplaying,
      isnowtime,
      lyricbox,
      changesong,
      changeSildeTime,
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
  background-color: #fff;
  .bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(50px) brightness(80%) saturate(100%);
  }
}
.top-box {
  display: flex;
  justify-content: space-between;
  align-items: center; //使元素水平居中对齐
  width: 100%;
  margin: 20px 0;
  padding: 8px 20px;
  height: 20px;
  > h4 {
    margin: 0;
    color: #ffffff;
    font-size: 18px;
    text-align: center;
    white-space: nowrap;
    // text-overflow: ellipsis;
    overflow: hidden;
    animation: runing 10s linear infinite;
    @keyframes runing {
      // 0% {
      //   transform: translateX(100%);
      // }
      // 100% {
      //   transform: translateX(0);
      // }
      0% {
        margin-left: 100%;
      }
      100% {
        margin-right: 0%;
      }
    }
  }
  .close {
    margin-left: 20px;
    width: 16px;
    height: 2px;
    border-radius: 2px;
    background: #ffffff;
    transform: rotate(45deg);
  }
  .close::after {
    content: "";
    display: block;
    width: 16px;
    height: 2px;
    border-radius: 2px;
    background: #ffffff;
    transform: rotate(-90deg);
  }
}

.song-infor-box {
  width: calc(100% - 160px);
  margin: 40px 80px 30px 80px;
  .img-running-box,
  .img-stop-box {
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
  height: calc(100% - 750px);
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
.controplayer-box {
  margin-top: 40px;
  padding: 0 20px;
  .time-box {
    display: flex;
    justify-content: space-between;
    .currenttime,
    .duration {
      color: #fff;
      width: 100%;
    }
    .currenttime {
      text-align: left;
      color: #ffffff80;
    }
    .duration {
      text-align: right;
      color: #ffffff80;
    }
  }
  .ant-slider {
    padding: 0;
    margin: 4px 0;
    width: 100%;
    :deep.ant-slider-horizontal .ant-slider-rail {
      height: 3px;
      background-color: rgba(255, 255, 255, 0.1);
    }
    :deep.ant-slider .ant-slider-track {
      height: 3px;
      background-color: #fff;
    }
    :deep.ant-slider .ant-slider-handle::after {
      width: 0;
      height: 0;
      margin-top: 2px;
      background-color: #fff;
      box-shadow: none;
    }
  }
  .player-box {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;

    .changesong-btn,
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
    .changesong-btn {
      color: #ffffff;
    }
  }
}
</style>

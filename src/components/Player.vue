<template>
  <div class="player-box">
    <div class="player-left">
      <div class="song-img-box">
        <img
          @click="clickSongImg"
          :src="Playersongs[index].al.picUrl"
          :class="{ 'img-running': playing, 'img-stop': !playing }"
        />
      </div>
      <div class="song-infor-box">
        <span class="song-name">{{
          Playersongs[index] ? Playersongs[index].name : ""
        }}</span>
        <!-- <span class="singer-name">{{
          songDuration(Playersongs[index].dt).time
        }}</span> -->
      </div>
    </div>
    <div class="player-rihgt">
      <div class="play-btn" @click="controlPlayer">
        <div v-if="!playing" class="tostop"></div>
        <div v-else class="toplay"></div>
      </div>
      <audio
        ref="audio"
        @ended="palyNextSong"
        :src="`https://music.163.com/song/media/outer/url?id=${Playersongs[index].id}.mp3`"
      ></audio>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, watch } from "vue";
import { useStore } from "vuex";

export default {
  name: "player",
  setup(props) {
    const store = useStore();
    const state = reactive({
      Playersongs: store.state.Playersongs,
      index: store.state.Index,
      playing: false,
      open: store.state.open,
      interVal: 0,
      audioduration: 0,
    });

    watch(
      [
        () => store.state.playing,
        () => store.state.Playersongs,
        () => store.state.Index,
        // () => store.state.SongDuration,
      ],

      () => {
        state.playing = store.state.playing;
        if (state.playing) {
          // audio.value.currentTime = store.state.currentTime;
          getAudiotime();
          // audio.value.play()
          let timeout = setTimeout(() => {
            audio.value.play();
            clearTimeout(timeout);
          }, 100);
          //为了防止报play()被中断的错误（中断好像是因为立即调用了pause(),网上说的这种方法：
          //https://segmentfault.com/q/1010000007130230
        } else {
          // audio.value.pause()
          let platout = setTimeout(() => {
            audio.value.pause(), clearTimeout(platout);
          }, 100);
          clearInterval(state.interVal);
        }
      }
    );

    watch(
      [() => store.state.Playersongs, () => store.state.Index],
      //注意监听这块，=>后面不要加{},而是直接写要被监听的内容
      () => {
        state.Playersongs = store.state.Playersongs;
        state.index = store.state.Index;
        audio.value.autoplay = true;
        state.playing = true;
      }
    );

    const audio = ref();
    const controlPlayer = () => {
      if (state.playing) {
        // audio.value.currentTime = 0;
        audio.value.pause();
        store.commit("updatePlaying", false);
        getAudiotime();
      } else {
        audio.value.play();
        audio.value.isPlaying = true;
        store.commit("updatePlaying", true);
        clearInterval(state.interVal); //清除定时器
      }
    };

    //点击唱片，打开SongDetai组件
    const clickSongImg = () => {
      // store.commit("updatePlayersongs", state.Playersongs);
      // store.commit("updateIndex", state.index);
      store.commit("updateOpen", true);
      //为什么不先点歌名，直接点唱片就会报错呢？好像是api请求时，没拿到id，获取不到详情
    };

    //传送播放器当前播放了多长时间（毫秒）
    const getAudiotime = () => {
      state.interVal = setInterval(() => {
        store.commit("updateTime", audio.value.currentTime); //value不能去掉，否则就拿不到播放器时间了
      }, 100);
      // return state.interVal//不知道能不能解决currentTime报错问题
      // console.log("每秒打印播放时间：" + audio.value.currentTime);
    };

    // const songDuration = (value) => {
    //   console.log("传的value是：" + value);
    //   const min = (value / 60000).toFixed(0);
    //   const sec = ((value % 60000) / 1000).toFixed(2);
    //   if (sec < 10) {
    //     let time = "00" + " : " + "0" + min + " : " + sec;
    //     return { time };
    //   } else {
    //     let time = "00" + " : " + min + " : " + sec;
    //     return { time };
    //   }
    // };

    const palyNextSong = () => {
      let num = state.index + 1;
      if (num === state.Playersongs.length) {
        num = 0;
      }
      store.commit("updateIndex", num);
    };

    return {
      ...toRefs(state),
      controlPlayer,
      audio,
      clickSongImg,
      getAudiotime,
      palyNextSong,
      // songDuration,
    };
  },
};
</script>
<style lang="less" scoped>
.player-box {
  display: flex;
  justify-content: space-between;
  position: absolute;
  width: calc(100% - 60px);
  padding: 10px;
  background-color: #eee;
  border-radius: 100px;
  text-align: left;
  .player-left {
    display: flex;
    align-items: center;
    .song-img-box {
      display: inline-block;
      height: 52px;
      width: 52px;
      margin-right: 10px;
      .img-running,
      .img-stop {
        width: 100%;
        height: 100%;
        border-radius: 100px;
        object-fit: cover;
      }
      .img-running {
        animation: spin 3s linear infinite;
        @keyframes spin {
          0% {
            /*rotate(2D旋转) scale(放大或者缩小) translate(移动) skew(翻转)*/
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        animation-play-state: running;
      }
      .img-stop {
        animation-play-state: paused;
      }
    }

    .song-infor-box {
      display: inline-block;
      .song-name {
        display: block;
        line-height: 24px;
        font-size: 16px;
        font-weight: 500;
        color: #242424;
      }
      .singer-name {
        display: block;
        line-height: 24px;
        color: #999;
      }
    }
  }
  .player-rihgt {
    display: inline-flex;
    .play-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      width: 40px;
      margin: auto;
      background: rgb(8, 149, 102);
      border-radius: 100px;

      .toplay {
        width: 0;
        height: 0;
        border: 8px solid transparent;
        border-left: 12px solid white;
        margin-left: 10px;
        border-radius: 2px;
        transform: rotate(360deg);
      }
      .tostop {
        height: 12px;
        width: 12px;
        border-radius: 2px;
        background: white;
      }
    }
  }
}
</style>

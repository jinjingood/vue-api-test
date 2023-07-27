<template>
  <div class="player-box">
    <div class="player-left">
      <div class="song-img-box">
        <img
          @click="clickSongImg(Playersong[index])"
          :src="Playersong[index].al.picUrl"
          :class="{ 'img-running': playing, 'img-stop': !playing }"
        />
      </div>
      <div class="song-infor-box">
        <span class="song-name">{{
          Playersong[index] ? Playersong[index].name : ""
        }}</span>
        <span class="singer-name">放歌词</span>
      </div>
    </div>
    <div class="player-rihgt">
      <div class="play-btn" @click="controlPlayer">
        <div v-if="!playing" class="stoped"></div>
        <div v-else class="playing"></div>
      </div>
      <audio
        ref="audio"
        :src="`https://music.163.com/song/media/outer/url?id=${Playersong[index].id}.mp3`"
      ></audio>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, watch, onMounted, computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "player",
  setup(props) {
    const store = useStore();
    const state = reactive({
      Playersong: store.state.Playersong,
      index: store.state.Index,
      playing: false,
      open: store.state.open,
      interVal: 0,
    });

    watch(
      [
        () => store.state.playing,
        () => store.state.Playersong,
        () => store.state.Index,
      ],
      () => {
        // state.playing = Object.assign(store.state.playing);
        state.playing = store.state.playing;
        if (state.playing) {
          getAudiotime();
          audio.value.play();
        } else {
          audio.value.pause();
          clearInterval(state.interVal);
        }

        console.log(
          "播放器监听到了store中playing为：" +
            JSON.stringify(store.state.playing)
        );
        console.log("播放器的playing为：" + JSON.stringify(state.playing));
      }
    );

    const audio = ref();
    const controlPlayer = () => {
      if (state.playing) {
        audio.value.pause();
        // audio.value.Timeupdate();
        // state.playing = false;
        store.commit("updatePlaying", false);
        getAudiotime();
      } else {
        audio.value.play();
        // state.playing = true;
        store.commit("updatePlaying", true);
        clearInterval(state.interVal); //清除定时器
      }
    };
    const clickSongImg = () => {
      store.commit("updateOpen", true);
      console.log("播放器点击了唱片");
    };

    //传送播放器当前的播放了多吃时间（毫秒）
    const getAudiotime = () => {
      state.interVal = setInterval(() => {
        store.commit("updateTime", audio.value.currentTime);
      }, 500);
      console.log("每秒打印播放时间：" + audio.value.currentTime);
    };

    watch(
      [() => store.state.Playersong, () => store.state.Index],
      //注意监听这块，=>后面不要加{},而是直接写要被监听的内容
      () => {
        state.Playersong = store.state.Playersong;
        state.index = store.state.Index;
        audio.value.autoplay = true;
        state.playing = true;
      }
    );
    return {
      ...toRefs(state),
      controlPlayer,
      audio,
      clickSongImg,
      getAudiotime,
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

      .playing {
        width: 0;
        height: 0;
        border: 8px solid transparent;
        border-left: 12px solid white;
        margin-left: 10px;
        border-radius: 2px;
        transform: rotate(360deg);
      }
      .stoped {
        height: 12px;
        width: 12px;
        border-radius: 2px;
        background: white;
      }
    }
  }
}
</style>

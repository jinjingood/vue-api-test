<template>
  <div class="player-box">
    <div class="player-left">
      <div class="song-img-box">
        <img :src="Playersong[index].al?.picUrl" class="song-img" />
      </div>
      <div class="song-infor-box">
        <span class="song-name">{{ Playersong[index].al?.name }}</span>
        <span class="singer-name">music.author</span>
      </div>
    </div>
    <div class="player-rihgt">
      <div class="play-btn" @click="controlPlayer">
        <span v-if="!playing">playing</span>
        <span v-if="playing">stop</span>
      </div>
      <audio
        ref="audio"
        :src="`https://music.163.com/song/media/outer/url?id=${Playersong[index].id}.mp3`"
      ></audio>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs, ref } from "vue";
import { useStore, mapState } from "vuex";

export default {
  name: "player",
  // computed: {
  //   ...mapState("Playersong", "Index"),
  // },
  setup() {
    const store = useStore();
    const state = reactive({
      Playersong: store.state.Playersong,
      index: store.state.Index,
      playing: false,
    });
    const audio = ref();
    const controlPlayer = () => {
      if (state.playing) {
        audio.value.pause();
        state.playing = false;
      } else {
        audio.value.play();
        state.playing = true;
      }
    };
    return {
      ...toRefs(state),
      controlPlayer,
      audio,
    };
  },
};
</script>
<style lang="less" scoped>
.player-box {
  position: fixed;
  bottom: 10px;
  display: flex;
  justify-content: space-between;
  width: calc(100% - 100px);
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
      .song-img {
        width: 100%;
        height: 100%;
        border-radius: 100px;
        object-fit: cover;
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
      height: 40px;
      width: 40px;
      margin: auto;
      background: #6c73da;
      border-radius: 100px;
    }
  }
}
</style>

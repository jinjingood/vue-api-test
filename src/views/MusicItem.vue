<template>
  <div class="page-box">
    <Nev class="nev" />
    <MusicListHeader
      :playlist="playlist"
      class="MusicListHeader"
    ></MusicListHeader>
    <PlayList
      :songlist="songlist"
      :songdetail="songdetail"
      @clickSongName="openSongDetail"
      class="PlayList"
    ></PlayList>
    <div class="SongDetail-box" v-if="open">
      <SongDetail
        :songdetail="songdetail"
        :songlist="songlist"
        @closeSongDetail="closeSongDetail"
        @changeSongDetail="changeSongDetail"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router"; //写这个才能把<router-link>携带的参数接受到
import { getPlaylist, getAllMusic, getLyrics } from "@/requests/api/home";
import MusicListHeader from "@/components/MusicListHeader.vue";
import PlayList from "@/components/PlayList.vue";
import Nev from "@/components/Nev.vue";
import SongDetail from "@/components/SongDetail.vue";

export default {
  name: "MusicItem",
  components: { MusicListHeader, PlayList, Nev, SongDetail },
  // props: [],
  setup() {
    const store = useStore();
    const state = reactive({
      playlist: {},
      songlist: [],
      trackIds: [],
      open: store.state.Open,
      songdetail: {},
      index: store.state.Index,
    });
    
    watch(
      () => store.state.Open,
      () => {
        state.open = store.state.Open;
        // console.log("监听到了store中open的变化：" + store.state.Open);
      }
    );

    watch(
      () => store.state.Index,
      () => {
        state.songdetail = state.songlist[store.state.Index];
      }
    );

    const openSongDetail = (index) => {
      state.songdetail = state.songlist[index];
      store.commit("updateOpen", true);
    };

    const changeSongDetail = (num) => {
      store.commit("updateIndex", num);
      console.log("接收到了索引号：" + num);
      openSongDetail();
    };

    const closeSongDetail = (value) => {
      state.open = value;
      store.commit("updateOpen", false);
    };

    onMounted(async () => {
      //获取歌单id
      let id = useRoute().query.id;
      //将歌单id传给歌曲详情api，获取详情页头部需要的歌单详情
      let res = await getPlaylist(id);
      state.playlist = res.data.playlist;

      //获取歌单详情的前20首歌
      // state.songlist = res.data.playlist.tracks;

      //获取歌单的全部歌曲，供PlayList组件展示歌单
      //1.根据官网说明，要通过trackids获取歌单中的id
      let trackIdsdata = res.data.playlist.trackIds;
      trackIdsdata.forEach((item) => {
        return state.trackIds.push(item.id);
      });
      //2.把id数组传给api
      let result = await getAllMusic(state.trackIds);
      state.songlist = result.data.songs;
      // console.log("songlist:"+JSON.stringify(state.songlist));

      //将数据保存到sessionStorage里
      localStorage.setItem("musicitem保存数据：", JSON.stringify(state));

      // //获取歌词
      // let ressult2 = await getLyrics(state.songdetail.id);
      // state.lyrics = ressult2.data;
      // console.log("歌词是：" + JSON.stringify(state.lyrics.lrc?.lyric));
    });

    return {
      ...toRefs(state),
      openSongDetail,
      closeSongDetail,
      changeSongDetail,
    };
  },
};
</script>

<style lang="less" scoped>
.page-box {
  width: 100vw;
  margin: 0 30px;
  overflow: hidden;
  .nev {
    //头部返回必须单独写成组件，否则图层太深，无法点击到，也就无法触发-点击返回上一步-这个事件
    position: absolute;
  }
  .MusicListHeader {
    position: absolute;
    position: fixed;
    width: calc(100% - 60px);
    height: 100%;
    z-index: -1;
  }
  .PlayList {
    position: fixed;
    margin-top: 220px;
    width: calc(100% - 60px);
    // box-shadow: 0 -10px 20px 10px #0000006e;
  }
  .SongDetail-box {
    position: fixed;
    width: calc(100% - 60px);
    height: calc(100% - 82px);
    z-index: 1;
    transition: all 1s ease-out;
  }
}
</style>

<template>
  <div class="page-box">
    <MusicListHeader
      :playlist="playlist"
      class="MusicListHeader"
    ></MusicListHeader>
    <PlayList :songlist="songlist" class="PlayList"></PlayList>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import { useRoute } from "vue-router"; //写这个才能把<router-link>携带的参数接受到
import { getPlaylist, getAllMusic } from "@/requests/api/home";
import MusicListHeader from "@/components/MusicListHeader.vue";
import PlayList from "@/components/PlayList.vue";
import { arrayType } from "ant-design-vue/es/_util/type";

export default {
  components: { MusicListHeader, PlayList },
  props: [],
  setup() {
    const state = reactive({
      playlist: {},
      songlist: [],
      trackIds: {},
    });

    onMounted(async () => {
      //   console.log("useRoute:" + JSON.stringify(useRoute()));
      let id = useRoute().query.id;
      //   console.log("id:" + id);
      let res = await getPlaylist(id);
      state.playlist = res.data.playlist;
      //   let result = await getAllMusic(id);
      state.songlist = res.data.playlist.tracks;
      //     state.songlist.push(res.data.songs)
      //   console.log("歌单详情：" + JSON.stringify(state.playlist));
      //   let trackIds = res.data.playlist.trackIds;
      //   const trackIdsArr = () => {
      //     trackIds.forEach((item) => {
      //       let arr = [];
      //       arr = arr.push(item.id);
      //       console.log("arr：" + arr);
      //       return arr
      //     });
      //   };
      //   let trackIdsArr = [];
      //   for (let i = 0; i <= trackIds.length; i++) {
      //     let trackIdsArr=trackIds[i].id;
      //     let res=await getAllMusic(trackIdsArr)
      //     state.songlist.push(res.data.songs)
      //     // return trackIdsArr
      //     console.log("trackIds：" + JSON.stringify(trackIdsArr));
      //   }
      console.log("songs列表：" + JSON.stringify(state.songlist));
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less" scoped>
.page-box {
  overflow: hidden;
  .MusicListHeader {
    position: absolute;
    width: calc(100% - 60px);
    height: 100%;
    z-index: -1;
  }
  .PlayList {
    position: absolute;
    margin-top: 220px;
    width: calc(100% - 60px);
  }
}
</style>

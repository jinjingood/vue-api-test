import { createStore } from "vuex";

export default createStore({
  state: {
    MusicList: JSON.parse(localStorage.getItem("MusicList")) || [], //这是本地上传练习

    Playersong: [
      {
        id: 159538805,
        name: "HAPPINESS (会幸福的）",
        al: {
          pic: 109951168199040700,
          pic_str: 109951168199040706,
          picUrl:
            "http://p1.music.126.net/0gBVK6ZCYkThGr5zins_Zw==/109951168199040706.jpg",
        },
        id: 2020450026,
      },
    ],
    Index: 0,
    playing: false,
    Open: false,
    CurrentTime: 0, //播放器播放到多少毫秒
  },
  getters: {},
  mutations: {
    UPLOAD(state, obj) {
      state.MusicList.unshift(obj);
    },
    updatePlayersong(state, value) {
      state.Playersong = value;
    },
    updateIndex(state, index) {
      state.Index = index;
    },
    updatePlaying(state, value) {
      state.playing = value;
      console.log("store的playing变了：" + state.playing);
    },
    updateOpen(state, value) {
      state.Open = value;
    },
    updateTime(state, value) {
      state.CurrentTime = value;
    },
  },
  actions: {},
  modules: {},
});

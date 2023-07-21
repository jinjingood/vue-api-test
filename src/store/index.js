import { createStore } from "vuex";

export default createStore({
  state: {
    MusicList: JSON.parse(localStorage.getItem("MusicList")) || [],
    Playersong: [
      {
        al: {
          id: 159538805,
          name: "HAPPINESS (会幸福的）",
          // pic: 109951168199040700,
          // pic_str: 109951168199040706,
          picUrl:
            "http://p1.music.126.net/0gBVK6ZCYkThGr5zins_Zw==/109951168199040706.jpg",
        },
        // id: 2011061243,
        id: 2020450026,
      },
    ],
    Index: 0,
  },
  getters: {},
  mutations: {
    UPLOAD(state, obj) {
      state.MusicList.unshift(obj);
    },
  },
  actions: {},
  modules: {},
});

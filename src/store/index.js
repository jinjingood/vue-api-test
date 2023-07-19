import { createStore } from "vuex";

export default createStore({
  state: {
    MusicList: JSON.parse(localStorage.getItem("MusicList")) || [],
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

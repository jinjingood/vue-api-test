import { createStore } from "vuex";

export default createStore({
    state: {
        MusicList: JSON.parse(localStorage.getItem("MusicList")) || [], //这是本地上传练习

        Playersongs: [{
            id: 159538805,
            name: "HAPPINESS (会幸福的）",
            al: {
                pic: 109951168199040700,
                pic_str: 109951168199040706,
                picUrl: "http://p1.music.126.net/0gBVK6ZCYkThGr5zins_Zw==/109951168199040706.jpg",
            },
            id: 2020450026,
        }, ],
        Index: 0,
        playing: false,
        Open: false,
        CurrentTime: 0, //播放器播放到多少毫秒
        SongDuration: 0,
        SongDetail: {},
    },
    getters: {},
    mutations: {
        UPLOAD(state, obj) {
            state.MusicList.unshift(obj);
        },
        updatePlayersongs(state, value) {
            state.Playersongs = value;
        },
        updateIndex(state, index) {
            state.Index = index;
        },
        // changeIndex(state, num) {//跟upadatIndex写重了
        //     state.Index = num;
        // },
        updatePlaying(state, value) {
            state.playing = value;
            // console.log("store的playing变了：" + state.playing);
        },
        updateOpen(state, value) {
            state.Open = value;
        },
        updateTime(state, value) {
            // if (isNaN(value)) { state.CurrentTime = 0 } else {

            //     // state.CurrentTime = value
            // }
            state.CurrentTime = value * 1000;
        },
        sentDuration(state, value) {
            state.SongDuration = value;
        },

        updateSongDetail(state, value) {
            state.SongDetail = value;
            console.log("store接收到切歌：" + JSON.stringify(state.SongDetail));
        },
    },
    actions: {},
    modules: {},
});
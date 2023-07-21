<template>
  <div class="Mplaye-box">
    <h1>musicplayer</h1>
    <Player></Player>
    <a-upload
      accept="audio/*"
      @change="upload"
      :before-upload="beforeUpload"
      :showUploadList="false"
    >
      <a-button type="primary"> Upload </a-button>
    </a-upload>
  </div>
  <div class="Mlist-box">
    <div v-for="(item, index) in MusicList" :key="index" class="Mlist-item">
      <div class="infor">
        <span>{{ item.name }}</span
        ><span> {{ item.size }} </span>
        <span> {{ item.type }} </span>
      </div>
      <div><a-button>paly</a-button></div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed } from "vue";
import Player from "@/components/Player.vue";
import { useStore } from "vuex";

export default {
  components: {
    Player,
  },
  setup() {
    const store = useStore();
    const state = reactive({
      MusicList: store.state.MusicList,
    });
    const getMusicData = () => {
      const data = localStorage.getItem("MusicList");
      if (data !== null) {
        return JSON.parse(data);
      } else {
        return [];
      }
    };
    const saveMusicData = () => {
      localStorage.setItem("MusicList", JSON.stringify(state.MusicList));
    };
    const beforeUpload = () => {
      return false; //因为上传中、完成、失败都会调用change这个函数，所以不处理的话，上传时就会请求三次，看后台会发现每次上传都打印了3次file。不确定这样写有什么坑，但解决了请求三次的问题
      //我结合2个网址得出的写法：http://react-china.org/t/ant-design/5166/6，https://segmentfault.com/q/1010000039719516
    };
    const upload = (file) => {
      if (file) {
        const type = file.file.type.substring(file.file.type.indexOf("/") + 1); //参考自：https://juejin.cn/s/js%E6%88%AA%E5%8F%96%E6%8C%87%E5%AE%9A%E5%AD%97%E7%AC%A6%E5%90%8E%E9%9D%A2%E7%9A%84%E5%86%85%E5%AE%B9
        const name = file.file.name.substring(file.file.name.indexOf("."), 0); //参考自：https://juejin.cn/post/7090714873222397989
        const size = computed(() => {
          if (file.file.size < 1024) {
            return file.file.size + "B";
          } else if (file.file.size < 1024 * 1024) {
            return (file.file.size / 1024).toFixed(2) + "KB";
          } else if (file.file.size < 1024 * 1024 * 1024) {
            return (file.file.size / (1024 * 1024)).toFixed(2) + "MB";
          } else {
            return (file.file.size / (1024 * 1024 * 1024)).toFixed(2) + "GB";
          } //换算公式来自网址中的方法2：https://www.cnblogs.com/willingtolove/p/9409979.html
        });
        for (let i = 0; i < state.MusicList.length; i++) {
          if (state.MusicList[i].name === name) {
            alert("同名文件已存在，上传失败");
            console.log("进入查重了");
            return;
          }
        }
        const obj = {
          // name: state.MusicList.name,
          //如果写了antd自带的v-model:file-list="fileList"，那么antd自己也会生成一个file对象,但里面的数据结构跟html自身的file输出的file对象非常不同，此时用file.file.name去取值就会出错，可能是因为冲突
          name: name,
          size: size,
          type: type,
          file: file,
        };
        store.commit("UPLOAD", obj);
        const local = getMusicData();
        saveMusicData(local);
        console.log("state.MusicList:" + JSON.stringify(state.MusicList));
      }
    };

    // const play = (index) => {
    //   const audio = state.MusicList[index];
    //   if (audio.url) {
    //     const audioPlayer = new Audio();
    //     audioPlayer.src = URL.createObjectURL(audio.url);
    //     audioPlayer.play();
    //   } else {
    //     console.error("音乐文件的URL为空");
    //   }
    // };

    return {
      ...toRefs(state),
      upload,
      // play,
      beforeUpload,
    };
  },
};
</script>

<style lang="less" scoped>
// .ant-upload-list-item-container
.Mplaye-box,
.Mlist-box {
  margin: 0 50px !important;
}
.Mlist-box {
  .Mlist-item,
  .infor {
    width: 100%;
    margin-right: 30px;
    display: flex;
    justify-content: space-between;
  }
  .Mlist-item {
    margin: 8px;
    padding: 4px 8px;
    line-height: 40px;
    background-color: #eeeeee;
  }
}
</style>

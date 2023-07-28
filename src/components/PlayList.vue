<template>
  <div class="songlist-bg">
    <div v-for="(item, index) in songlist" :key="index" class="songlist-box">
      <div class="songlist-item" @click="PlayThisSong(index)">
        <div class="index">
          {{ index + 1 }}
        </div>
        <div class="name" @click="clickSongName(index)">
          <span class="songname">{{ item.name }}</span>
          <span>{{ item.ar[0].name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, watch, computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "PlayList",
  props: ["songlist"],
  setup(props, context) {
    const store = useStore();
    const state = reactive({
      interVal: 0,
    });

    const PlayThisSong = (index) => {
      store.commit("updatePlayersongs", props.songlist);
      store.commit("updateIndex", index);
      store.commit("updatePlaying", true);
      context.emit("clickSongList", index);
      //这里出了很大的错，我原先在state里面声明了一个songlist：props.songlist，结果导致store.commit一直传的是空值，只有这个组件我修改后，才能拿到。
      //原因1：props.songlist只会在一开始拿到1次，所以我需要监听props.songlist才行
      //改法1:因为我拿到props.songlist不需要做啥变化，直接就用，所以不需要在state用一个变量来承接props.songlist
      //原因2:因为直接写songlist：props.songlist的话，state.songlist就会和props.songlist是同一个地址，那么这2个只要任何1个变化都会影响这个地址，也就是会互相污染同一个地址的数据，从而产生bug
      //改法2:所以如果想写songlist：props.songlist的话，最好写成：songlist：[...props.songlist],这样[...props.songlist]其实在一个新地址，也就不会污染原始地址
      //改法3:同理，还可以用object.assign（）来写
    };

    const clickSongName = (index) => {
      store.commit("updatePlaying", true);
      context.emit("clickSongName", index);
      // console.log("点击歌名：" + JSON.stringify(props.songlist[index]));
    };

    return { ...toRefs(state), PlayThisSong, clickSongName };
  },
};
</script>

<style lang="less" scoped>
.songlist-bg {
  height: calc(100% - 240px);
  border-radius: 30px 30px 0 0;
  background-color: #fff;
  padding-bottom: 160px;
  // box-shadow: 0 -10px 20px 10px #00000060;
  overflow: hidden;
  overflow-y: scroll;

  .songlist-box {
    padding: 0 16px;

    .songlist-item {
      display: flex;
      padding: 16px 0 11px 0;
      text-align: left;
      border-bottom: 1px solid #eeeeee;
      .index {
        display: inline-block;
        width: 20px;
        margin-right: 16px;
        text-align: center;
      }
      .name {
        display: inline-block;
        // > span:first-child {
        //   font-size: 16px;
        //   font-weight: 600;
        //   line-height: 16px;
        // }
        .songname {
          display: block;
          font-size: 16px;
          font-weight: 600;
          line-height: 16px;
        }
        > span:last-child {
          color: #999;
        }
      }
    }
    .songlist-item:hover {
      .name {
        > span:first-child {
          color: rgb(8, 149, 102);
        }
      }
    }
  }
}
</style>

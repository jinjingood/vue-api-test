<template>
  <h2>播放器</h2>
  <div class="player-box">
    <div class="player-left">
      <h2>music.name</h2>
      <span>music.author</span>
    </div>
    <div class="player-rihgt"></div>
    <audio controls></audio>
  </div>
</template>
<style lang="less" scoped>
.player-box {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px 20px 10px 30px;
  background-color: #eee;
  border-radius: 100px;
  text-align: left;
  .player-left {
    width: 70%;
  }
  .player-rihgt {
    display: inline-flex;
    width: 70%;
  }
}
</style>

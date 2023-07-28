<template>
  <nav>
    <router-link to="/">MusicPlayer1</router-link> |
    <router-link to="/MusicPlayer2">MusicPlayer2</router-link>
  </nav>
  <div class="page-box">
    <router-view />
    <Player class="player" />
  </div>
</template>
<script>
import Player from "@/components/Player.vue";

export default {
  components: { Player },
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.page-box {
  overflow: hidden;
  .player {
    position: absolute;
    bottom: 10px;
    margin: 0 30px;
  }
}
</style>

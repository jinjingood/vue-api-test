<template>
  <div class="top-nev" @click="$router.go(-1)">
    <span class="back"></span>
    <span>每日推荐</span>
    <span>···</span>
  </div>
</template>

<script>
export default {
  name: "Nev",
  setup() {},
};
</script>

<style lang="less">
.top-nev {
  display: flex;
  justify-content: space-between;
  width: calc(100% - 60px);
  align-items: center;
  padding: 8px 16px;
  .back {
    display: inline-block;
    width: 10px;
    height: 2px;
    border-radius: 2px;
    background: rgb(33, 33, 33);
    transform: rotate(45deg);
  }
  .back::after {
    content: "";
    display: block;
    width: 10px;
    height: 2px;
    margin: -4.5px;
    border-radius: 2px;
    background: rgb(33, 33, 33);
    transform: rotate(-90deg);
  }
}
.top-nev:hover {
  .back {
    background: red;
  }
  .back::after {
    background: red;
  }
}
</style>

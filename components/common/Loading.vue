<template>
  <div class='loading'>
    <div class="loading_image"></div>
    <div class="loading_label">正在加载中...</div>
  </div>
</template>

<style scoped lang="scss">
  .loading {
    position: fixed;
    width: 100%;
    height: 100%;
    background: white;
    top: 0;
    left: 0;
    text-align: center;
    z-index: 9999;

    .loading_image {
      display: inline-block;
      margin-top: 30%;

      background-image: url("/img/common/loading.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: px2rem(320);
      height: px2rem(320);
    }

    .loading_label {
      margin-top: px2rem(10);
      font-size: px2rem(30);
      color: #333333;
    }
  }

</style>s

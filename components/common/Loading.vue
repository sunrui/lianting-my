<template>
  <div class="loading_mask">
    <div class='loading'>
      <div class="loading_image"></div>
      <div class="loading_label">正在加载中...</div>
    </div>
  </div>
</template>

<script>
  export default {}
</script>

<style scoped lang="scss">
  .loading_mask {
    position: fixed;
    width: 100%;
    height: 100%;
    background: white;
    top: 0;
    left: 0;
    text-align: center;
    z-index: 9999;
    animation: fade_mask 0.2s 0s linear 1;

    .loading {
      animation: fade_image 1s 0s linear infinite;
      animation-direction: alternate;
      -webkit-animation-direction: alternate;

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
        color: #666666;
      }
    }

    @keyframes fade_mask {
      0%, 99.9% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    }

    @keyframes fade_image {
      0% {
        opacity: 0.25;
        transform: scale(0.999);
      }

      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
  }

</style>

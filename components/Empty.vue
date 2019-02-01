<template>
  <div class="empty">
    <img class="empty_image" :src="image">
    <div class="empty_label">{{content}}</div>
  </div>
</template>

<script>
  export default {
    props: {
      image: {
        type: String,
        default: ''
      },
      content: {
        type: String,
        default: ''
      }
    }
  }

</script>

<style scoped lang="scss">
  @import '~assets/scss/common.scss';
  @import '~assets/scss/empty.scss';
</style>s

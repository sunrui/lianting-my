<template>
  <div class="header">
    <Button v-if="canBack" @click="btnBack">{{back}}</Button>
    <Button style="width: 400px">{{title}}</Button>
    <Button @click="btnHome">Home</Button>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        back: '<'
      }
    },
    computed: {
      canBack: function() {
        return this.$store.state.navbar.canBack
      },
      title: function() {
        return this.$store.state.navbar.title
      },
      home: function() {
        return this.$store.state.navbar.home
      }
    },
    methods: {
      btnBack() {
        this.$router.back(-1)
      },
      btnHome() {
        this.$router.push(this.home)
      }
    }
  }
</script>

<style scoped>
  .header {
    display: flex;
    margin-bottom: 20px;
  }
</style>

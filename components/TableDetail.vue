<template>
  <section>
    <p>餐桌标识 {{table.id}}</p>
    <p>餐桌组 {{table.tableGroup_name}}</p>
    <p>餐桌号{{table.fullNumber}}</p>
    <p>备注{{table.remark}}</p>
    <button @click="btnCaptcha"> {{tableUrl}}</button>
  </section>
</template>

<script>
  import {httpTableApi, httptableApi} from '../api/http/ltorder/httpTableApi'

  export default {
    middleware: 'auth',
    data() {
      return {
        table: {},
        tableUrl: null,
        shortId: null,
        tableId: null,
        ui: {}
      }
    },
    created() {
      this.shortId = this.$route.params.shortId
      this.tableId = this.$route.params.tableId

      if (!Boolean(this.tableId)) {
        this.tableId = this.$route.query.tableId
      }

      httpTableApi.getTable(this.shortId, this.tableId).then(res => {
        this.table = res
      })
    },
    mounted() {
      this.tableUrl = document.location.protocol + '//' + window.location.host + `/m/${this.shortId}/captcha/${this.tableId}`
    },
    methods: {
      btnCaptcha() {
        window.location.href = this.tableUrl
      }
    }
  }
</script>

<style scoped>

</style>

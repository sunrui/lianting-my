<template>
</template>

<script>
  import {stateApi} from '../../../../../api/local/stateApi'
  import {httpTableApi} from '../../../../../api/http/lt/httpTableApi'
  import {httpCaptchaApi} from '../../../../../api/http/lt/httpCaptchaApi'

  export default {
    middleware: 'auth',
    data() {
      return {}
    },
    created() {
      let tableOneId = this.$route.params.tableOneId
      if (!Boolean(tableOneId)) {
        this.invalidTable()
        return
      }

      this.httpTable(tableOneId)
    },
    methods: {
      invalidTable() {
        this.$msgBox.doModal({
          type: 'yes',
          title: '无效餐桌',
          content: '餐桌二维码已过期，请重新扫码或联系服务员。'
        })

        stateApi.table.setCaptchaTableId(null)
        stateApi.table.setTableName(null)
        stateApi.table.setTableNumber(null)
      },
      httpTable(tableOneId) {
        httpTableApi.getTable(this.$route.params.shortId, tableOneId).then(res => {
          if (res.notExists) {
            this.invalidTable()
          } else if (res.tableOne) {
            this.httpCaptchaTable(res.tableOne.id)
          } else {
            this.invalidTable()
          }
        })
      },
      httpCaptchaTable(tableOneId) {
        httpCaptchaApi.postCaptchaTable(this.$route.params.shortId, tableOneId).then(res => {
          if (res.tableOneNotExists) {
            this.invalidTable()
          } else {
            stateApi.table.setCaptchaTableId(res.captchaTableId)
            stateApi.table.setTableName(res.tableName)
            stateApi.table.setTableNumber(res.tableNumber)
            this.$router.push(`/m/${this.$route.params.shortId}`)
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .container {
    background: white;
    height: 100vh;
    text-align: center;
  }
</style>

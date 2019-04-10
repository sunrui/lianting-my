<template>
</template>

<script>
  import {userApi} from '../../../../../api/local/userApi'
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

        userApi.setCaptchaTableId(null)
        userApi.setTableName(null)
        userApi.setTableNumber(null)
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
            userApi.setCaptchaTableId(res.captchaTableId)
            userApi.setTableName(res.tableName)
            userApi.setTableNumber(res.tableNumber)

            this.$router.push(`/c/${this.$route.params.shortId}`)
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

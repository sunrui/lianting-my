<template>
  <div class="init">
    <div class="init_house"></div>

    <div class="blank_20"></div>

    <div class="task">
      <div class="task_one" v-for="(task, index) in ui.tasks">
        <div class="task_one_number">{{index + 1}}</div>
        <div class="task_one_content">
          <div class="task_one_content_label">{{task}}</div>
          <div class="task_one_content_finish"></div>
        </div>
      </div>
    </div>

    <div class="blank_100"></div>
    <div class="button_big" @click="btnShopOwner">进入店铺管理</div>
    <div class="blank_20"></div>
  </div>
</template>

<script>
  import {httpShopApi} from '../../../api/http/shop/httpShopApi'

  export default {
    metaInfo: {
      title: '店铺初始化'
    },
    middleware: 'auth',
    data() {
      return {
        http: {
          res: {
            shop: {}
          }
        },
        ui: {
          tasks: [
            '认证您的身份信息',
            '确认您的店铺唯一标识',
            '生成店铺初始化数据',
            '店铺创建成功'
          ]
        }
      }
    },
    created() {
      httpShopApi.getOne(this.$route.params.shortId).then(res => {
        this.http.res.shop = res
      })
    },
    methods: {
      btnShopOwner() {
        this.$router.push(`/b/${this.$route.params.shortId}/owner`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'init';
</style>

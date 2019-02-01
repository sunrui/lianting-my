<template>
  <section>
    <nav-bar></nav-bar>

    <div v-if="ui.loading">loading 的小圈圈</div>
    <div v-else>
      <h3>品牌信息</h3>
      <p>{{shopGroup.name}} ({{shopGroup.category}})</p>
      <p>{{shopGroup.corporation}}</p>
      <button @click="btnInfoEdit">资料修改</button>
      <hr>

      <p>同步管理</p>
      <ul>
        <li>
          <Button @click="btnFood">餐食</Button>
          <Button @click="btnTable">餐桌</Button>
          <Button @click="btnPay">支付通道</Button>
        </li>
      </ul>

      <p>统计报表</p>
      <ul>
        <li>
          <Button @click="btnFood">餐食</Button>
          <Button @click="btnFood">餐桌</Button>
          <Button @click="btnTable">排队</Button>
        </li>
      </ul>
      <ul>
        <li>
          <Button @click="btnFood">预订</Button>
          <Button @click="btnFood">外卖</Button>
          <Button @click="btnTable">收益</Button>
        </li>
      </ul>

    </div>
  </section>
</template>

<script>
  import {httpShopGroupApi} from '../../../../api/http/shop/httpShopGroupApi'
  import NavBar from '../../../../components/NavBar'

  export default {
    metaInfo: {
      title: '品牌管理'
    },
    middleware: 'auth',
    components: {NavBar},
    data() {
      return {
        ui: {},
        shopGroup: null
      }
    },
    created() {
      this.$store.commit('navbar/update', {
        canBack: true,
        title: '品牌管理',
        home: '/'
      })

      httpShopGroupApi.get(this.$route.params.shopGroupId).then(res => {
        this.shopGroup = res
      })

    },
    methods: {
      btnInfoEdit() {
        this.$router.push(`/shop/group/${this.$route.params.shopGroupId}/info/edit`)
      }
    }
  }
</script>

<style scoped>

</style>

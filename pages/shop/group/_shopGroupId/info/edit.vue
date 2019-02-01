<template>
  <section>
    <nav-bar></nav-bar>

    <div ref="shopGroupReq" :model="shopGroupReq.model" :rules="shopGroupReq.rule">
      <div class="form-group">
        <label>品牌名称</label>
        <input type="text" class="form-control" v-model="shopGroupReq.model.name" placeholder="如：恋厅">
      </div>
      <div class="form-group">
        <label>企业信息</label>
        <input type="text" class="form-control" v-model="shopGroupReq.model.corporation" placeholder="企业名称">
      </div>
    </div>

    <Button @click="btnInfoModify">修改</Button>

  </section>
</template>

<script>
  import {httpShopGroupApi} from '../../../../../api/http/shop/httpShopGroupApi'
  import NavBar from '../../../../../components/NavBar'

  export default {
    metaInfo: {
      title: '编辑品牌资料'
    },
    middleware: 'auth',
    components: {NavBar},
    data() {
      return {
        ui: {},
        shopGroupReq: {
          model: {
            name: null,
            category: null,
            corporation: null,
            type: ''
          },
          rule: {
            name: [
              {required: true, message: '请输入店铺名称', trigger: 'blur'},
              {type: 'string', min: 1, max: 32, message: '店铺名长度需在 1 - 32 位之间', trigger: 'blur'}
            ],
            category: [
              {required: true, message: '请输入主营类目', trigger: 'blur'},
              {type: 'string', min: 1, max: 32, message: '店铺名长度需在 1 - 32 位之间', trigger: 'blur'}
            ],
            corporation: [
              {required: true, message: '请输入公司名称', trigger: 'blur'},
              {type: 'string', min: 2, max: 20, message: '公司名称长度需在 4 - 20 位之间', trigger: 'blur'}
            ]
          }
        }
      }
    },
    created() {
      this.$store.commit('navbar/update', {
        canBack: true,
        title: '编辑品牌资料',
        home: '/'
      })

      httpShopGroupApi.get(this.$route.params.shopGroupId).then(res => {
        this.shopGroupReq.model = res
      })
    },
    methods: {
      btnUpdate() {
        httpShopGroupApi.put(this.$route.params.shopGroupId, this.shopGroupReq.model).then(res => {
          alert('修改成功')
          this.$router.back()
        })

      }
    }
  }
</script>

<style scoped>

</style>

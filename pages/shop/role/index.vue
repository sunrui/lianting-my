<template>
  <div>
    <title-bar ref="titleBar" :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="top_blank"></div>

    <div class="box" v-for="(role, index) in http.res.roles">
      <div class="shop_info">
        <div class="shop_info_logo" @click="btnShop(role.shop)">
          <div class="shop_logo_radius shop_logo_radius_center">
            <img class="shop_logo_radius_image" :src="getLogo(role.shop)" alt="">
          </div>
        </div>

        <div class="shop_title">
          <div class="shop_title_name">{{role.shop.name}}</div>
          <div class="shop_title_license">
            <span class="shop_title_license_king"></span>
            <span class="shop_title_license_label">{{
                role.shop.licenseType === 'Free' ? '免费会员' :
                role.shop.licenseType === 'Normal' ? '标准会员' :
                role.shop.licenseType === 'Senior' ? '旗舰会员' : role.shop.licenseType
                }}
            </span>
          </div>
        </div>

        <div class="shop_short_id">唯一标识 {{role.shop.shortId}}</div>

        <div class="box_divide"></div>

        <div class="shop_role">
          <div class="shop_role_one" v-for="type in role.types">
            <div v-if="type.toLowerCase() === oneRole.role" v-for="oneRole in ui.roles" @click="btnRole(role.shop, oneRole.role)">
              <img class="shop_role_one_logo" :src="oneRole.image" :alt="oneRole.name">
              <div class="shop_role_one_label">{{oneRole.name}}</div>
            </div>
          </div>
        </div>

        <div class="shop_footer"></div>
      </div>

      <div class="shop_divide" v-if="index !== http.res.roles.length - 1"></div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../../../components/common/TitleBar'
  import {httpInfoApi} from '../../../api/http/lt/httpInfoApi'
  import {httpRoleApi} from "../../../api/http/lt/httpRoleApi"

  export default {
    metaInfo: {
      title: '工作台'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: false,
          title: '工作台',
          theme: 'image',
          imageHeight: 330
        },
        http: {
          res: {
            roles: [],
            infos: []
          }
        },
        ui: {
          roles: [
            {image: '/img/role/role_owner.png', name: '管理员', role: 'owner'},
            {image: '/img/role/role_admin.png', name: '店长', role: 'admin'},
            {image: '/img/role/role_waiter.png', name: '服务员', role: 'waiter'},
            {image: '/img/role/role_cooker.png', name: '厨师', role: 'cooker'},
            {image: '/img/role/role_cashier.png', name: '财务', role: 'cashier'}
          ],
          unActive: 0
        }
      }
    },
    created() {
      this.httpRole()
    },
    methods: {
      httpRole() {
        httpRoleApi.getAll(0, 99).then(res => {
          if (res.length === 0) {
            this.$router.push('/shop/role/empty')
            return
          }

          for (let index in res) {
            let role = res[index]
            this.httpShopInfo(role.shop)
          }

          this.http.res.roles = res
        })
      },
      httpShopInfo(shop) {
        httpInfoApi.get(shop.shortId).then(res => {
          if (!Boolean(res.logo)) {
            res.logo = '/img/default/default_shop_logo.png'
          }

          let info = {
            shortId: shop.shortId,
            info: res
          }

          this.http.res.infos.push(info)
        })
      },
      getLogo(shop) {
        for (let index in this.http.res.infos) {
          let info = this.http.res.infos[index]
          if (info.shortId === shop.shortId) {
            return info.info.logo
          }
        }

        return ''
      },
      btnShop(shop) {
        this.$router.push(`/c/${shop.shortId}`)
      },
      btnRole(shop, role) {
        this.$router.push(`/b/${shop.shortId}/${role}`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import "~assets/c/shop";
  @import '~assets/b/b_shop';
  @import '../index';
</style>

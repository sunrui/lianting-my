<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="top_blank"></div>

    <div class="box" v-bind:key="shopGroup.id" v-for="shopGroup in http.res.shop.shopGroups">
      <div class="group_box box_radius">
        <div class="group_box_name">{{shopGroup.name}}</div>
      </div>

      <div class="box" v-for="(shop, index) in shopGroup.shops">
        <div class="shop_info">
          <div class="shop_info_logo" @click="btnShop(shop)">
            <div class="shop_logo_radius shop_logo_radius_center">
              <img class="shop_logo_radius_image" :src="getLogo(shop)">
            </div>
          </div>

          <div class="shop_title">
            <div class="shop_title_name">{{shop.name}}</div>
            <div class="shop_title_license">
              <div class="shop_title_license_king"></div>
              <div class="shop_title_license_label">
                {{
                shop.licenseType === 'Normal' ? '普通会员' :
                shop.licenseType === 'Senior' ? '高级会员' :
                shop.licenseType === 'Vip' ? '至尊会员' : shop.licenseType
                }}
              </div>
            </div>
          </div>

          <div class="shop_short_id">唯一标识 {{shop.shortId}}</div>

          <div class="box_divide"></div>

          <div class="shop_role">
            <div class="shop_role_one" v-for="role in ui.roles">
              <img class="shop_role_one_logo" :src="role.image">
              <div class="shop_role_one_label">{{role.name}}</div>
            </div>
          </div>

          <div class="shop_footer"></div>
        </div>

        <div class="shop_divide" v-if="index !== shopGroup.shops.length - 1"></div>
      </div>
    </div>

    <div class="box" v-for="(shop, index) in http.res.shop.shops">
      <div class="shop_info">
        <div class="shop_info_logo" @click="btnShop(shop)">
          <div class="shop_logo_radius shop_logo_radius_center">
            <img class="shop_logo_radius_image" :src="getLogo(shop)">
          </div>
        </div>

        <div class="shop_title">
          <div class="shop_title_name">{{shop.name}}</div>
          <div class="shop_title_license">
            <span class="shop_title_license_king"></span>
            <span class="shop_title_license_label">
              {{
              shop.licenseType === 'Normal' ? '普通会员' :
              shop.licenseType === 'Senior' ? '高级会员' :
              shop.licenseType === 'Vip' ? '至尊会员' : shop.licenseType
              }}
            </span>
          </div>
        </div>

        <div class="shop_short_id">唯一标识 {{shop.shortId}}</div>

        <div class="box_divide"></div>

        <div class="shop_role">
          <div class="shop_role_one" v-for="role in ui.roles" @click="btnRole(shop, role.role)">
            <img class="shop_role_one_logo" :src="role.image">
            <div class="shop_role_one_label">{{role.name}}</div>
          </div>
        </div>

        <div class="shop_footer"></div>
      </div>

      <div class="shop_divide" v-if="index !== http.res.shop.shops.length - 1"></div>
    </div>

    <div class="shop_create" v-if="ui.unActive === 0">
      <div class="shop_create_button" @click="btnCreate">创建新的店铺</div>
    </div>

  </div>
</template>

<script>
  import TitleBar from '../../components/common/TitleBar'
  import { httpShopApi } from '../../api/http/shop/httpShopApi'
  import { httpInfoApi } from '../../api/http/ltorder/httpInfoApi'

  export default {
    metaInfo: {
      title: '我的店铺'
    },
    middleware: 'auth',
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: false,
          title: '我的店铺',
          theme: 'image',
          imageHeight: 330
        },
        http: {
          res: {
            shop: {
              shops: [],
              shopGroups: []
            },
            infos: []
          }
        },
        ui: {
          roles: [
            { image: '/img/role/role_owner.png', name: '管理员', role: 'owner' },
            { image: '/img/role/role_admin.png', name: '主管', role: 'admin' },
            { image: '/img/role/role_waiter.png', name: '服务员', role: 'waiter' },
            { image: '/img/role/role_cooker.png', name: '厨师', role: 'cooker' },
            { image: '/img/role/role_cashier.png', name: '财务', role: 'cashier' }
          ],
          unActive: 0
        }
      }
    },
    created() {
      this.httpShop()
    },
    methods: {
      httpShop() {
        httpShopApi.getAll(0, 999).then(res => {
          if (!res.shops && !res.shopGroups) {
            this.$router.push('/shop/create')
            return
          }

          this.http.res.shop = res

          for (let index in this.http.res.shop.shopGroups) {
            let shopGroup = this.http.res.shop.shopGroups[index]

            for (let shopIndex in shopGroup.shops) {
              let shop = shopGroup.shops[shopIndex]
              this.httpShopInfo(shop)
            }
          }

          for (let index in this.http.res.shop.shops) {
            let shop = this.http.res.shop.shops[index]
            this.httpShopInfo(shop)
          }
        })
      },
      httpShopInfo(shop) {
        if (shop.licenseType === 'UnActive') {
          this.ui.unActive++
        }

        httpInfoApi.get(shop.shortId).then(res => {
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
        this.$router.push(`/m/${shop.shortId}`)
      },
      btnRole(shop, role) {
        this.$router.push(`/b/${shop.shortId}/${role}`)
      },
      btnCreate() {
        this.$router.push(`/shop/create`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'index';
</style>

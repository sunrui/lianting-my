<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">名称</div>
          <label>
            <input class="addition_item_input" placeholder="请输入编辑餐桌组名称" maxlength="20" v-model="http.req.group.name">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">最小人数</div>
          <label>
            <input class="addition_item_input"
                   oninput="value=value.replace(/[^0-9]/g,''); if (value === '0') value = ''"
                   placeholder="请输入最小人数" maxlength="2" v-model="http.req.group.minPeople">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">最大人数</div>

          <label>
            <input class="addition_item_input"
                   oninput="value=value.replace(/[^0-9]/g,''); if (value === '0') value = ''"
                   placeholder="请输入最大人数" maxlength="2" v-model="http.req.group.maxPeople">
          </label>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">包间</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.group.privateRoom" @click="btnPrivateRoom(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnPrivateRoom(true)"></div>
          </div>

          <div class="box_divide"></div>

          <div class="addition_item">
            <div class="addition_item_label">号码前缀</div>
            <label>
              <input class="addition_item_input"
                     type="text"
                     placeholder="请输入号码前缀，如 A" minlength="1" maxlength="4" v-model="http.req.group.numberPrefix">
            </label>
          </div>

          <div class="box_divide"></div>

          <div class="addition_item">
            <div class="addition_item_label">号码后缀</div>
            <label>
              <input class="addition_item_input"
                     type="text"
                     placeholder="请输入号码后缀，如 8 (可选)" maxlength="4" v-model="http.req.group.numberSuffix">
            </label>
          </div>

          <div class="box_divide"></div>

          <div class="addition_item">
            <div class="addition_item_label">备注</div>
            <label>
              <input class="addition_item_input" placeholder="请输入备注" maxlength="64" v-model="http.req.group.remark">
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnUpdate">更新</div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../../../../../../../components/common/TitleBar'
  import { httpTableApi } from '../../../../../../../api/http/lt/httpTableApi'
  import { httpTableAdminApi } from '../../../../../../../api/http/lt/httpTableAdminApi'

  export default {
    metaInfo: {
      title: '编辑餐桌组'
    },
    middleware: 'auth',
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: true,
          title: '餐食组',
          backUri: `/b/${this.$route.params.shortId}/owner/table`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            group: {
              name: '',
              minPeople: '',
              maxPeople: '',
              numberPrefix: '',
              numberSuffix: '',
              privateRoom: false,
              remark: ''
            }
          }
        },
        ui: {}
      }
    },
    mounted() {
      this.httpGroup()
    },
    methods: {
      httpGroup() {
        httpTableApi.getGroupOne(this.$route.params.shortId, this.$route.params.groupId).then(res => {
          this.http.req.group = res
        })
      },
      btnPrivateRoom(privateRoom) {
        this.http.req.group.privateRoom = privateRoom
      },
      btnUpdate() {
        if (!Boolean(this.http.req.group.name)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '编辑餐桌组',
            content: '请输入编辑餐桌组名称'
          })

          return
        }

        if (!Boolean(this.http.req.group.minPeople)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '编辑餐桌组',
            content: '请输入最小人数'
          })

          return
        }

        if (!Boolean(this.http.req.group.maxPeople)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '编辑餐桌组',
            content: '请输入最大人数'
          })

          return
        }

        if (this.http.req.group.maxPeople < this.http.req.group.minPeople) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '编辑餐桌组',
            content: '最大人数须大于或等于最小人数'
          })

          return
        }

        if (!Boolean(this.http.req.group.numberPrefix)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '编辑餐桌组',
            content: '请输入号码前缀，如 A'
          })

          return
        }

        httpTableAdminApi.putGroup(this.$route.params.shortId, this.http.req.group).then(res => {
          if (res.tableGroupIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '编辑餐桌组',
              content: '编辑餐桌组不存在。'
            })
          } else if (res.nameExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '编辑餐桌组',
              content: '名称已存在。'
            })
          } else if (res.numberPrefixExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '编辑餐桌组',
              content: '前缀已存在。'
            })
          } else if (res.success) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '编辑餐桌组',
              content: '更新成功。'
            }).then(async (val) => {
              this.$router.push(this.title.backUri)
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>

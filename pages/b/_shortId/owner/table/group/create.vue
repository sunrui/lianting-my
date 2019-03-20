<template>
  <div>
    <title-bar ref="titleBar" :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">名称</div>
          <input class="addition_item_input" placeholder="请输入餐桌组名称" maxlength="20" v-model="http.req.group.name">
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">最小人数</div>
          <input type="number" class="addition_item_input"
                 oninput="this.value=this.value.replace(/[^0-9]/g,''); if (this.value === '0') this.value = '1'
                          if (value.length > 2) value = value.slice(0, 2)"
                 placeholder="请输入最小人数" v-model="http.req.group.minPeople">
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">最大人数</div>
          <input type="number" class="addition_item_input"
                 oninput="this.value=this.value.replace(/[^0-9]/g,''); if (this.value === '0') this.value = '1'
                          if (value.length > 2) value = value.slice(0, 2)"
                 placeholder="请输入最大人数" v-model="http.req.group.maxPeople">
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
            <input class="addition_item_input"
                   type="text"
                   placeholder="请输入号码前缀，如 A" minlength="1" maxlength="4" v-model="http.req.group.numberPrefix">
          </div>

          <div class="box_divide"></div>

          <div class="addition_item">
            <div class="addition_item_label">备注</div>
            <input class="addition_item_input" placeholder="请输入备注" maxlength="64" v-model="http.req.group.remark">
          </div>
        </div>
      </div>
    </div>


    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">预生成多少桌</div>
          <input type="number" class="addition_item_input"
                 oninput="this.value=this.value.replace(/[^0-9]/g,'');
                          if (value.length > 3) value = value.slice(0, 3)"
                 placeholder="请输入预生成多少桌" v-model="http.req.group.preGenTableCount">
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnCreate">添加</div>
    </div>
  </div>
</template>

<script>
  import {httpTableAdminApi} from '../../../../../../api/http/lt/httpTableAdminApi'
  import TitleBar from '../../../../../../components/common/TitleBar'
  import {langApi} from '../../../../../../api/local/langApi'

  export default {
    metaInfo: {
      title: '添加餐桌组'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '添加餐桌组',
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
              privateRoom: false,
              remark: '',
              preGenTableCount: ''
            }
          }
        },
        ui: {}
      }
    },
    created() {
    },
    methods: {
      btnPrivateRoom(privateRoom) {
        this.http.req.group.privateRoom = privateRoom
      },
      btnCreate() {
        if (!Boolean(this.http.req.group.name)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加餐桌组',
            content: '请输入餐桌组名称'
          })

          return
        }

        if (!Boolean(this.http.req.group.minPeople)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加餐桌组',
            content: '请输入最小人数'
          })

          return
        }

        if (!Boolean(this.http.req.group.maxPeople)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加餐桌组',
            content: '请输入最大人数'
          })

          return
        }

        if (parseInt(this.http.req.group.maxPeople) < parseInt(this.http.req.group.minPeople)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加餐桌组',
            content: '最大人数必须大于最小人数'
          })

          return
        }

        if (!Boolean(this.http.req.group.numberPrefix)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加餐桌组',
            content: '请输入号码前缀，如 A'
          })

          return
        }

        if (!Boolean(this.http.req.group.preGenTableCount)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加餐桌组',
            content: '请输入预生成多少桌'
          })

          return
        }

        httpTableAdminApi.postGroup(this.$route.params.shortId, this.http.req.group).then(res => {
          if (res.maxLimit) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加餐桌组',
              content: langApi.maxLimit
            })
          } else if (res.nameExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加餐桌组',
              content: '名称已存在。'
            })
          } else if (res.numberPrefixExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加餐桌组',
              content: '前缀已存在。'
            })
          } else if (res.tableGroupId) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加餐桌组',
              content: '添加成功。'
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

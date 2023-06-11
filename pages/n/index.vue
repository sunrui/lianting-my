<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">新闻类型</div>
          <div class="addition_item_tag">
            <div class="addition_item_tag_one addition_item_tag_label addition_item_tag_color_2"
                 v-if="http.req.news.type === 'ProductTutorial'"
                 @click="btnChooseType('CompanyNews')">产品教程
            </div>
            <div class="addition_item_tag_one addition_item_tag_label addition_item_tag_color_3"
                 v-if="http.req.news.type === 'CompanyNews'"
                 @click="btnChooseType('IndustryNews')">公司新闻
            </div>
            <div class="addition_item_tag_one addition_item_tag_label addition_item_tag_color_1"
                 v-if="http.req.news.type === 'IndustryNews'"
                 @click="btnChooseType('ProductTutorial')">行业新闻
            </div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">hashKey</div>
          <label>
            <input class="addition_item_input" placeholder="请输入 hashKey" maxlength="20"
                   oninput="value=value.replace(/[^0-9]/g,'');"
                   v-model="http.req.news.hashKey" @change="btnChangeHashKey()">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">缩略图</div>
          <div class="addition_item_avatar_input">
            <image-upload type="news" :hash-key="http.req.news.hashKey" :file-url="http.req.news.shortcut" v-on:uploadSuccess="uploadShortcutSuccess"></image-upload>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label_text_area">标题</div>
          <div class="addition_item_text_area">
            <label>
              <textarea class="addition_item_text_input" placeholder="请输入标题" v-model="http.req.news.title"></textarea>
            </label>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">来源名称</div>
          <label>
            <input class="addition_item_input" placeholder="请输入来源名称" minlength="1" maxlength="64" v-model="http.req.news.referName">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">来源地址</div>
          <label>
            <input class="addition_item_input" placeholder="请输入来源地址" minlength="1" maxlength="256" v-model="http.req.news.referUrl">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">来源时间</div>
          <label>
            <input class="addition_item_input" placeholder="请输入来源时间" minlength="1" maxlength="256" v-model="http.req.news.referDate">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">关键词</div>
          <label>
            <input class="addition_item_input" placeholder="请输入关键词" maxlength="256" v-model="http.req.news.keywords">
          </label>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div v-for="content in ui.contents">
          <div class="addition_item" v-if="content.url">
            <div class="addition_item_label">图片</div>
            <div class="addition_item_avatar_input">
              <image-upload type="news" :hash-key="http.req.news.hashKey" :file-url="content.url"></image-upload>
            </div>
          </div>
          <div class="addition_item" v-if="content.text">
            <div class="addition_item_label_text_area">内容</div>
            <div class="addition_item_text_area">
              <label>
                <textarea class="addition_item_text_input" placeholder="请输入标题" v-model="content.text"></textarea>
              </label>
            </div>
          </div>

          <div class="box_divide"></div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">图片</div>
          <div class="addition_item_avatar_input">
            <image-upload ref="imageUpload_AddContent" type="news" :hash-key="http.req.news.hashKey" :file-url="ui.content.url"
                          v-on:uploadSuccess="uploadContentUrlSuccess"></image-upload>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label_text_area">内容</div>
          <div class="addition_item_text_area">
            <label>
              <textarea class="addition_item_text_input" placeholder="请输入标题" v-model="ui.content.text"></textarea>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="blank_20"></div>
      <div class="food_add box_radius" @click="btnContentAdd()">
        <div class="food_add_icon"></div>
        <div class="food_add_label">添加内容 (目前字数: {{getContent().length}})</div>
      </div>

      <div class="blank_30"></div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnCreate">添加</div>
    </div>

  </div>
</template>

<script>
  import TitleBar from '../../components/common/TitleBar'
  import ImageUpload from '../../components/common/ImageUpload'
  import {httpNewsApi} from '../../api/http/news/httpNewsApi'
  import {stringApi} from '../../api/local/stringApi'
  import {scrollApi} from '../../api/local/scrollApi'
  import {timeApi} from "../../api/local/timeApi";

  export default {
    metaInfo: {
      title: '行业新闻'
    },
    middleware: 'auth',
    components: {TitleBar, ImageUpload},
    data() {
      return {
        title: {
          canBack: false,
          title: '行业新闻',
          backUri: ``,
          theme: 'image',
          imageHeight: 330
        },
        http: {
          req: {
            news: {
              magicId: 'honeysense',
              type: 'IndustryNews',
              hashKey: '2023',
              shortcut: '',
              title: '',
              content: '',
              referName: '网络',
              referUrl: '',
              referDate: '',
              keywords: ''
            }
          },
          res: {}
        },
        ui: {
          content: {
            url: null,
            text: null
          },
          contents: []
        }
      }
    },
    mounted() {
      this.$refs.imageUpload_AddContent.setFileName(null)
      this.$refs.imageUpload_AddContent.setFileUrl(null)

      this.http.req.news.hashKey = timeApi.dateFormat(new Date(), 'yyyyMMddHHmmss');
      this.http.req.news.referName = '恋厅资讯'
      this.http.req.news.referUrl = '恋厅' + timeApi.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss');
      this.http.req.news.referDate = timeApi.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss');
      this.http.req.news.keywords = '点餐系统,扫码点餐'
    },
    methods: {
      btnChooseType(type) {
        this.http.req.news.type = type
      },
      btnChangeHashKey() {
        this.$refs.imageUpload_AddContent.setHashKey(this.http.req.news.hashKey)
      },
      uploadShortcutSuccess(fileUrl) {
        this.http.req.news.shortcut = fileUrl
      },
      uploadContentUrlSuccess(fileUrl) {
        this.ui.content.url = fileUrl
      },
      getContent() {
        let contentText = ''

        for (let index in this.ui.contents) {
          let content = this.ui.contents[index]

          if (Boolean(content.text)) {
            contentText += `<p>${content.text}</p>`
          }

          if (Boolean(content.url)) {
            contentText += `<img src="${content.url}" alt="恋厅 - 扫码点餐 - 配图">`
          }
        }

        return contentText
      },
      btnContentAdd() {
        if (!Boolean(this.ui.content.url) && !Boolean(this.ui.content.text)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加内容',
            content: '内容为空。'
          })
          return
        }

        let content = {
          url: stringApi.trim(this.ui.content.url),
          text: stringApi.trim(this.ui.content.text)
        }

        this.ui.contents.push(content)

        this.ui.content = {
          url: null,
          text: null
        }

        this.$refs.imageUpload_AddContent.setFileName(null)
        this.$refs.imageUpload_AddContent.setFileUrl(null)

        scrollApi.scrollAnimation(scrollApi.getCurrentY(), scrollApi.getCurrentBottom())
      },
      btnCreate() {
        if (!Boolean(this.http.req.news.type)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加新闻',
            content: '请输入新闻类型。'
          })

          return
        }

        if (!Boolean(this.http.req.news.hashKey)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加新闻',
            content: '请输入 hashKey。'
          })

          return
        }

        if (!Boolean(this.http.req.news.title)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加新闻',
            content: '请输入标题。'
          })

          return
        }

        this.http.req.news.title = stringApi.trim(this.http.req.news.title)

        if (!Boolean(this.http.req.news.referName)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加新闻',
            content: '请输入来源名称。'
          })

          return
        }

        if (!Boolean(this.http.req.news.referUrl)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加新闻',
            content: '请输入来源地址。'
          })

          return
        }

        if (!Boolean(this.http.req.news.referDate)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加新闻',
            content: '请输入来源日期。'
          })

          return
        }

        if (this.ui.contents.length === 0) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加新闻',
            content: '请输入内容。'
          })

          return
        }

        let contentText = this.getContent()
        if (contentText.length >= 15000) {
          contentText = contentText.substring(0, 14999)
        }

        this.http.req.news.content = contentText

        if (this.http.req.news.referUrl.length > 255) {
          this.http.req.news.referUrl = this.http.req.news.referUrl.substring(0, 254)
        }

        if (!Boolean(this.http.req.news.content)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加新闻',
            content: '请输入内容。'
          })

          return
        }

        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: '添加新闻',
          content: '确认要添加新闻吗？'
        }).then(async (val) => {
          if (val !== 'Yes') {
            return
          }

          httpNewsApi.postContent(this.http.req.news).then(res => {
            if (res.magicIdNotMatch) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '添加新闻',
                content: '魔法串不正确。'
              })

              return
            }

            if (res.forbidden) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '添加新闻',
                content: '没有权限。'
              })

              return
            }

            if (res.titleExists) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '添加新闻',
                content: '标题已存在。'
              })

              return
            }

            if (res.hashKeyExists) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '添加新闻',
                content: 'hashKey 已经存在。'
              })

              return
            }

            if (res.referUrlExists) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '添加新闻',
                content: '引用地址已存在。'
              })

              return
            }

            if (res.success) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '添加新闻',
                content: '添加成功。'
              }).then(async (val) => {
                location.reload()
              })
            }
          })
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/c/food';
</style>

<template>
  <div :id="ui.imageUploadId" class="image-upload">
    <div class="badge_delete" v-if="ui.fileUrl || fileUrl" @click="btnUploadDelete"></div>
    <div :id="ui.pickFileId" @click="btnUploadWechat">
      <div class="image_upload_image_box" v-if="ui.fileUrl || fileUrl">
        <img class="image_upload_image" :src="ui.fileUrl ? ui.fileUrl : fileUrl" alt="">
      </div>
      <div class="image_upload_button"></div>
    </div>
  </div>
</template>

<script>
  import {httpUploadApi} from '../../api/http/lt/httpUploadApi'
  import {httpWechatApi} from '../../api/http/lt/httpWechatApi'
  import plupload from 'plupload'
  import {uuidApi} from '../../api/local/uuidApi'
  import {httpUploadApi as httpUploadAdminApi} from '../../api/http/lt/httpUploadAdminApi'
  import {wechatApi} from '../../api/local/wechatApi'
  import {urlApi} from '../../api/local/urlApi'

  export default {
    data() {
      return {
        ui: {
          imageUploadId: null,
          pickFileId: null,
          percent: 0,
          fileUrl: null,
          fileName: null
        }
      }
    },
    props: {
      b: {
        type: Boolean,
        default: false
      },
      fileUrl: {
        type: String,
        default: null
      }
    },
    mounted() {
      this.ui.imageUploadId = uuidApi.uuid()
      this.ui.pickFileId = uuidApi.uuid()

      if (Boolean(this.fileUrl)) {
        this.ui.fileUrl = this.fileUrl
      }

      if (!wechatApi.inWechat()) {
        this.initOssSign(null)
      }
    },
    methods: {
      btnUploadDelete() {
        this.ui.fileUrl = null
        this.$emit('uploadSuccess', this.ui.fileUrl)
      },
      btnUploadWechat() {
        if (wechatApi.inWechat()) {
          this.initWxConfig(this)
        }
      },
      getFileName() {
        if (!Boolean(this.ui.fileName)) {
          if (Boolean(this.ui.fileUrl)) {
            let index = this.ui.fileUrl.lastIndexOf('/')
            if (index !== -1) {
              this.ui.fileName = this.ui.fileUrl.substr(index)
              if (this.ui.fileName.length < 32) {
                this.ui.fileName = null
              } else {
                this.ui.fileName = this.ui.fileName.substr(0, 32)
              }
            }
          }

          if (!Boolean(this.ui.fileName)) {
            this.ui.fileName = uuidApi.uuid()
          }
        }

        return this.ui.fileName
      },
      initWxConfig(pThis) {
        httpWechatApi.getConfig(this.$route.params.shortId, urlApi.getCurrentUrl()).then(res => {
          let wx = require('weixin-js-sdk')

          wx.config({
            debug: false,
            appId: res.appId,
            timestamp: res.timestamp,
            nonceStr: res.noncestr,
            signature: res.signature,
            jsApiList: [
              'chooseImage',
              'previewImage',
              'uploadImage',
              'downloadImage',
              'getLocalImgData']
          })

          wx.ready(function () {
            wx.chooseImage({
              count: 1,
              sizeType: ['original', 'compressed'],
              sourceType: ['album', 'camera'],
              success(res) {
                wx.getLocalImgData({
                  localId: res.localIds[0],
                  success(res) {
                    let localData = res.localData
                    if (localData.indexOf('data:image') !== 0) {
                      localData = 'data:image/jpeg;base64,' + localData
                    }

                    localData = localData.replace(/[\r\n]/g, '').replace('data:image/jgp', 'data:image/jpeg')
                    pThis.initOssSign(localData)
                  }, fail(res) {
                    pThis.$msgBox.doModal({
                      type: 'yes',
                      title: '上传图片失败',
                      content: JSON.stringify(res)
                    })
                  }
                })
              }
            })
          })

          wx.error(function (res) {
            pThis.$msgBox.doModal({
              type: 'yes',
              title: '上传图片失败',
              content: res
            }).then(async (val) => {
              location.reload()
            })
          })
        })
      },
      initOssSign(localData) {
        function init(pThis, res) {
          if (wechatApi.inWechat()) {
            fetch(localData)
                .then(res => res.blob())
                .then(blob => {
                  pThis.initStreamUploader(res, blob, pThis)
                })
          } else {
            pThis.initFileUploader(res, pThis)
          }
        }

        if (this.b) {
          httpUploadAdminApi.getSignImage(this.$route.params.shortId).then(res => {
            init(this, res)
          })
        } else {
          httpUploadApi.getSignImage(this.$route.params.shortId).then(res => {
            init(this, res)
          })
        }
      },
      onUploadSuccess(sign) {
        this.ui.fileUrl = document.location.protocol + '//' + sign.endPoint + '/' + sign.key + this.getFileName()
        this.$emit('uploadSuccess', this.ui.fileUrl)

        let index = this.ui.fileUrl.lastIndexOf('?')
        if (index !== -1) {
          this.ui.fileUrl = this.ui.fileUrl.substr(0, index)
        }
        this.ui.fileUrl += '?r=' + Math.random()
        this.$set(this.ui, 'fileUrl', this.ui.fileUrl)
      },
      initStreamUploader(sign, localData, pThis) {
        let param = {
          'key': sign.key + this.getFileName(),
          'policy': sign.policy,
          'OSSAccessKeyId': sign.accessId,
          'success_action_status': '200',
          'callback': '',
          'signature': sign.signature
        }

        let formData = new FormData()
        for (let field_name in param) {
          formData.append(field_name, param[field_name])
        }
        formData.append('file', localData)

        let xmlHttpRequest = new XMLHttpRequest()
        xmlHttpRequest.upload.onprogress = function (e) {
          if (e.type === 'progress') {
            let percent = e.loaded / e.total * 100
            this.ui.percent = Math.round(percent) + '%'
          }
        }

        xmlHttpRequest.onreadystatechange = function () {
          if (xmlHttpRequest.readyState === 4 && xmlHttpRequest.status === 200) {
            pThis.onUploadSuccess(sign)
          }
        }

        xmlHttpRequest.open('POST', document.location.protocol + '//' + sign.endPoint)
        xmlHttpRequest.send(formData)
      },
      initFileUploader(sign, pThis) {
        let uploader = new plupload.Uploader({
          runtimes: 'html5,html4',
          browse_button: pThis.ui.pickFileId,
          unique_names: true,
          multi_selection: false,
          container: document.getElementById(this.ui.imageUploadId),
          resize: {quality: 90},
          filters: {
            max_file_size: '512kb',
            mime_types: [
              {title: '图片', extensions: 'jpg,jpeg,gif,png'}
            ]
          },
          init: {
            PostInit() {
            },
            FilesAdded(up, files) {
              plupload.each(files, function (file) {
              })

              let new_multipart_params = {
                'key': sign.key + pThis.getFileName(),
                'policy': sign.policy,
                'OSSAccessKeyId': sign.accessId,
                'success_action_status': '200',
                'callback': '',
                'signature': sign.signature
              }

              uploader.setOption({
                'url': document.location.protocol + '//' + sign.endPoint,
                'multipart_params': new_multipart_params
              })

              uploader.start()
            },

            UploadProgress(up, file) {
              pThis.ui.percent = file.percent
            },
            FileUploaded(up, file, info) {
              pThis.onUploadSuccess(sign)
            },
            Error(up, err) {
              if (err.code === -600) {
                pThis.$msgBox.doModal({
                  type: 'yes',
                  title: '上传图片失败',
                  content: '图片过大会影响顾客的流量和加载速度，请不要上传超过 512kb 的图片。'
                })
              } else if (err.code === -601) {
                pThis.$msgBox.doModal({
                  type: 'yes',
                  title: '上传图片失败',
                  content: '请选择正确的图片文件。'
                })
              } else if (err.code === -602) {
                pThis.$msgBox.doModal({
                  type: 'yes',
                  title: '上传图片失败',
                  content: '文件已经上传。'
                })
              } else {
                pThis.$msgBox.doModal({
                  type: 'yes',
                  title: '上传图片失败',
                  content: err.response
                })
              }
            }
          }
        })

        uploader.init()
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "~assets/common";
  @import "ImageUpload";
</style>

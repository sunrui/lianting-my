<template>
  <div id="image-upload">
    <div class="badge_delete" v-if="ui.fileUrl || fileUrl" @click="btnUploadDelete"></div>
    <div :id="ui.pickFileId" @click="btnUploadWechat">
      <div class="image_upload_image_box" v-if="ui.fileUrl || fileUrl">
        <img class="image_upload_image" :src="ui.fileUrl ? ui.fileUrl : fileUrl" alt="">
      </div>
      <div class="image_upload_button" v-else></div>
    </div>
  </div>
</template>

<script>
  import {httpUploadApi} from '../../api/http/lt/httpUploadApi'
  import {httpWechatApi} from '../../api/http/lt/httpWechatApi'
  import plupload from 'plupload'
  import {uuidApi} from '../../api/local/uuidApi'
  import {httpUploadApi as httpUploadAdminApi} from '../../api/http/lt/httpUploadAdminApi'

  export default {
    data() {
      return {
        ui: {
          pickFileId: null,
          inWechat: false,
          state: 'wait',
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
    created() {
      this.ui.pickFileId = uuidApi.uuid()

      if (Boolean(this.fileUrl)) {
        this.ui.fileUrl = this.fileUrl
      }
    },
    mounted() {
      let userAgent = navigator.userAgent.toLowerCase() || window.navigator.userAgent.toLowerCase()
      this.ui.inWechat = userAgent.match(/MicroMessenger/i) || userAgent.match(/webdebugger/i)
      if (!this.ui.inWechat) {
        this.initOssSign(null)
      }
    },
    methods: {
      btnUploadDelete() {
        this.ui.fileUrl = null
        this.$emit('uploadSuccess', this.ui.fileUrl)
      },
      btnUploadWechat() {
        if (this.ui.inWechat) {
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
        let url = location.href.split('#')[0]
        httpWechatApi.getConfig(this.$route.params.shortId, url).then(res => {
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
                      title: '上传图片',
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
              title: '上传图片',
              content: res
            })
          })
        })
      },
      initOssSign(localData) {
        function init(pThis, res) {
          if (pThis.ui.inWechat) {
            fetch(localData)
              .then(res => res.blob())
              .then(blob => {
                pThis.initStreamUploader(res, blob)
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
      initStreamUploader(sign, localData) {
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

        xmlHttpRequest.open('POST', document.location.protocol + '//' + sign.endPoint)
        xmlHttpRequest.send(formData)
        this.ui.state = 'Uploaded'

        this.ui.fileUrl = document.location.protocol + '//' + sign.endPoint + '/' + sign.key + this.getFileName()

        let index = this.ui.fileUrl.lastIndexOf('?')
        if (index !== -1) {
          this.ui.fileUrl = this.ui.fileUrl.substr(0, index)
        }

        this.ui.fileUrl += '?' + new Date().getTime()
        this.$emit('uploadSuccess', this.ui.fileUrl)
      },
      initFileUploader(sign, pThis) {
        let uploader = new plupload.Uploader({
          runtimes: 'html5,html4',
          browse_button: pThis.ui.pickFileId,
          unique_names: true,
          multi_selection: false,
          container: document.getElementById('image-upload'),
          resize: {quality: 85},
          filters: {
            max_file_size: '512kb',
            mime_types: [
              {title: '图片', extensions: 'jpg,jpeg,gif,png'}
            ]
          },
          init: {
            PostInit() {
              pThis.ui.state = 'wait'
            },
            FilesAdded(up, files) {
              plupload.each(files, function (file) {
                pThis.ui.fileUrl = document.location.protocol + '//' + sign.endPoint + '/' + sign.key + pThis.getFileName()
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
              pThis.ui.state = 'Uploaded'

              let index = pThis.ui.fileUrl.lastIndexOf('?')
              if (index !== -1) {
                pThis.ui.fileUrl = pThis.ui.fileUrl.substr(0, index)
              }

              pThis.ui.fileUrl += '?' + new Date().getTime()
              pThis.$emit('uploadSuccess', pThis.ui.fileUrl)
            },
            Error(up, err) {
              if (err.code === -600) {
                pThis.$msgBox.doModal({
                  type: 'yes',
                  title: '上传图片',
                  content: '选择的文件最大不超过512kb。'
                })
              } else if (err.code === -601) {
                pThis.$msgBox.doModal({
                  type: 'yes',
                  title: '上传图片',
                  content: '请选择正确的图片文件。'
                })
              } else if (err.code === -602) {
                pThis.$msgBox.doModal({
                  type: 'yes',
                  title: '上传图片',
                  content: '文件已经上传。'
                })
              } else {
                pThis.$msgBox.doModal({
                  type: 'yes',
                  title: '上传图片',
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

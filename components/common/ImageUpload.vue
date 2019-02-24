<template>
  <div id="image-upload">
    <div class="image_upload_button" v-if="ui.inWechat" @click="btnUploadWechat"></div>
    <div v-else id="pickfiles">
      <img class="image_upload_image" v-if="ui.fileUrl" :src="ui.fileUrl" alt="">
      <img class="image_upload_image" v-else-if="fileUrl" :src="fileUrl" alt="">
      <div class="image_upload_button" v-else="ui.state !== 'uploaded' || !fileUrl"></div>
    </div>
  </div>
</template>

<script>
  import {httpUploadAdminApi} from '../../api/http/lt/httpUploadAdminApi'
  import {httpWechatApi} from '../../api/http/lt/httpWechatApi'
  import plupload from 'plupload'
  import {uuidApi} from "../../api/local/uuidApi"

  export default {
    data() {
      return {
        ui: {
          inWechat: false,
          state: 'wait',
          percent: 0,
          fileUrl: null
        }
      }
    },
    props: {
      fileUrl: {
        type: String,
        default: null
      }
    },
    created() {
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
      btnUploadWechat() {
        if (this.ui.inWechat) {
          this.initWxConfig(this)
        }
      },
      getFileName() {
        let fileName = null

        if (Boolean(this.fileUrl)) {
          let index = this.fileUrl.lastIndexOf('/')
          if (index !== -1) {
            fileName = this.fileUrl.substr(index)
            if (fileName.length < 32) {
              fileName = null
            } else {
              fileName = fileName.substr(0, 32)
            }
          }
        }

        if (!Boolean(fileName)) {
          fileName = uuidApi.uuid()
        }

        return fileName + '.png'
      },
      initWxConfig(pThis) {
        let url = location.href.split('#')[0]
        httpWechatApi.getConfig(this.$route.params.shortId, url).then(res => {
          let wx = require('weixin-js-sdk')

          wx.config({
            debug: true,
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

                    localData = localData.replace(/[\r\n]/g, '').replace('data:image/jpg', 'data:image/jpeg')
                    pThis.initOssSign(localData)
                  }, fail(res) {
                    this.$msgBox.doModal({
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
            this.$msgBox.doModal({
              type: 'yes',
              title: '上传图片',
              content: res
            })
          })
        })
      },
      initOssSign(localData) {
        httpUploadAdminApi.getSignImage(this.$route.params.shortId).then(res => {
          if (this.inWechat) {
            fetch(localData)
              .then(res => res.blob())
              .then(blob => {
                this.initStreamUploader(res, blob)
              })
          } else {
            this.initFileUploader(res, this)
          }
        })
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
            let percent = Math.round(e.loaded / e.total * 100, 2) + '%'
            console.log(percent)
          }
        }

        xmlHttpRequest.onreadystatechange = function (e) {
          if (xmlHttpRequest.readyState === 4) {
            if (xmlHttpRequest.status === 200)
              console.log('成功')
            else
              console.log('失败')
          }
        }
        xmlHttpRequest.open('POST', 'http://' + sign.endPoint)
        xmlHttpRequest.send(formData)
      },
      initFileUploader(sign, pThis) {
        let uploader = new plupload.Uploader({
          runtimes: 'html5,html4',
          browse_button: 'pickfiles',
          unique_names: true,
          multi_selection: false,
          container: document.getElementById('image-upload'),
          resize: {quality: 85},
          filters: {
            max_file_size: '512kb',
            mime_types: [
              {title: '图片', extensions: 'jpg,gif,png'}
            ]
          },
          init: {
            PostInit() {
              pThis.ui.state = 'wait'
            },
            FilesAdded(up, files) {
              plupload.each(files, function (file) {
                pThis.ui.fileUrl = 'http://' + sign.endPoint + '/' + sign.key + pThis.getFileName()
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
                'url': 'http://' + sign.endPoint,
                'multipart_params': new_multipart_params
              })

              uploader.start()
            },

            UploadProgress(up, file) {
              pThis.ui.percent = file.percent
            },
            FileUploaded(up, file, info) {
              pThis.ui.state = 'uploaded'

              let index = pThis.ui.fileUrl.lastIndexOf('?')
              if (index !== -1) {
                pThis.ui.fileUrl = pThis.ui.fileUrl.substr(0, index)
              }

              pThis.ui.fileUrl += '?' + new Date().getTime()

              console.log(pThis.ui.fileUrl)

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
  @import "ImageUpload";
</style>

<template>
  <div style="border: 1px">
    <div id="container">
      <button v-if="inWechat" @click="btnUpload">[上传图片从微信+]</button>
      <input v-if="!inWechat" type="file" id="pickfiles" href="javascript:;" name="[上传图片从本地+]" accept="image/*">
    </div>

    <p>{{ui}}</p>
    <img v-if="ui.file" :src="ui.file">

    <p>{{ui.file}}</p>

    <br/>
    <pre id="console"></pre>

  </div>
</template>

<script>
  import {httpUploadAdminApi} from '../api/http/ltorder/httpUploadAdminApi'
  import {httpWechatApi} from '../api/http/ltorder/httpWechatApi'

  export default {
    async asyncData({store, route, userAgent}) {
      return {
        userAgent
      }
    },
    middleware: 'user-agent',
    data() {
      return {
        shortId: null,
        ui: {
          state: 'wait',
          percent: 0,
          file: null
        }
      }
    },
    props: ['name', 'inWechat'],
    mounted() {
      this.shortId = this.$route.params.shortId

      // alert('in wechat: ' + this.inWechat);
      if (!this.inWechat) {
        this.initOssSign(null)
      }
    },
    methods: {
      btnUpload() {
        // alert('inWechat = ' + this.inWechat);
        if (this.inWechat) {
          this.initWxConfig(this)
        }
      },
      initWxConfig(pThis) {
        let url = location.href.split('#')[0]
        httpWechatApi.getConfig(this.shortId, url).then(res => {
          console.log(res)

          let wx = require('weixin-js-sdk')

          wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.appId, // 必填，公众号的唯一标识
            timestamp: res.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.noncestr, // 必填，生成签名的随机串
            signature: res.signature,// 必填，签名
            jsApiList: ['chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getLocalImgData'] // 必填，需要使用的JS接口列表
          })

          wx.ready(function() {
            // alert('ready');
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。

            wx.chooseImage({
              count: 1, // 默认9
              sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
              success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                // alert(JSON.stringify(res));

                // alert('开始获取图片的数据');


                wx.getLocalImgData({  //循环调用  getLocalImgData
                  localId: res.localIds[0], // 图片的localID
                  success: function(res) {
                    // alert('获取图片数据成功')

                    let localData = res.localData // localData是图片的base64数据，可以用img标签显示

                    // if (window.__wxjs_is_wkwebview) { // 如果是IOS，需要去掉前缀
                    //   localData = localData.replace('jgp', 'jpeg');
                    // } else {
                    //   localData = 'data:image/jpeg;base64,' + localData;
                    // }

                    if (localData.indexOf('data:image') !== 0) {
                      //判断是否有这样的头部
                      localData = 'data:image/jpeg;base64,' + localData
                    }
                    localData = localData.replace(/[\r\n]/g, '').replace('data:image/jgp', 'data:image/jpeg')

                    pThis.initOssSign(localData)
                  }, fail: function(res) {
                    alert(JSON.stringify(res))
                  }
                })

                //
                // alert('开始上传文件至微信');
                // wx.uploadImage({
                //   localId: res.localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                //   isShowProgressTips: 1, // 默认为1，显示进度提示
                //   success: function (res) {
                //     let serverId = res.serverId; // 返回图片的服务器端ID
                //
                //     alert('上传成功，服务器 id ' + serverId);
                //
                //     wx.downloadImage({
                //       serverId: serverId, // 需要下载的图片的服务器端ID，由uploadImage接口获得
                //       isShowProgressTips: 1, // 默认为1，显示进度提示
                //       success: function (res) {
                //         alert('下载服务器成功');
                //         alert(JSON.stringify(res));
                //       }
                //     });
                //
                //   }
                // });

              }
            })

          })

          wx.error(function(res) {
            console.log(res)
          })
        })
      },
      initOssSign(localData) {
        // alert('init oss sign');

        httpUploadAdminApi.getSignImage(this.shortId).then(res => {
          console.log(res)
          if (this.inWechat) {
            // alert('in wechat, init steam uploader');
            fetch(localData)
              .then(res => res.blob())
              .then(blob => {
                this.initStreamUploader(res, this.name, blob)
              })
          } else {
            // alert('not in wechat, init file uploader');
            this.initFileUploader(res, this.name, this)
          }
        })
      },
      initStreamUploader(sign, name, localData) {
        let param = {
          'key': sign.key + name,
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
        //上传进度监听
        xmlHttpRequest.upload.onprogress = function(e) {
          if (e.type === 'progress') {
            let percent = Math.round(e.loaded / e.total * 100, 2) + '%'
            console.log(percent)
          }

          // alert(JSON.stringify(e));

        }
        //上传结果
        xmlHttpRequest.onreadystatechange = function(e) {
          if (xmlHttpRequest.readyState === 4) {
            if (xmlHttpRequest.status === 200)
              console.log('成功')
            else
              console.log('失败')
          }

          // alert(JSON.stringify(e));
        }
        xmlHttpRequest.open('POST', 'http://' + sign.endPoint)
        // xmlHttpRequest.setRequestHeader("Content-Type", "image/jpeg");
        xmlHttpRequest.send(formData)
      },
      initFileUploader(sign, name, pThis) {
        let uploader = new plupload.Uploader({
          runtimes: 'html5,html4',
          browse_button: 'pickfiles', // you can pass in id...
          unique_names: true,
          multi_selection: false,
          container: document.getElementById('container'), // ... or DOM Element itself
          // url: "http://" + sign.endPoint,
          resize: {quality: 90},
          filters: {
            max_file_size: '512kb',
            mime_types: [
              {title: 'Image files', extensions: 'image/*,jpg,jpeg,png'}
            ]
          },
          init: {
            PostInit: function() {
              pThis.ui.state = 'wait'
            },
            FilesAdded: function(up, files) {
              // alert('files added');


              plupload.each(files, function(file) {
                console.log(file.name)
                pThis.ui.file = 'http://' + sign.endPoint + '/' + sign.key + name
              })

              let new_multipart_params = {
                'key': sign.key + name,
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

            UploadProgress: function(up, file) {
              console.log('uploading....' + file.percent)

              pThis.ui.percent = file.percent
            },
            FileUploaded: function(up, file, info) {
              console.log('[FileUploaded] File:', file, 'Info:', info)
              pThis.ui.state = 'uploaded'
            },
            Error: function(up, err) {
              document.getElementById('console').innerHTML += '\nError #' + err.code + ': ' + err.message

              if (err.code === -600) {
                document.getElementById('console').appendChild(document.createTextNode('\n选择的文件太大了,可以根据应用情况，在upload.js 设置一下上传的最大大小'))
              } else if (err.code === -601) {
                document.getElementById('console').appendChild(document.createTextNode('\n选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型'))
              } else if (err.code === -602) {
                document.getElementById('console').appendChild(document.createTextNode('\n这个文件已经上传过一遍了'))
              } else {
                document.getElementById('console').appendChild(document.createTextNode(err.response))
              }
            }
          }
        })

        uploader.init()
      }
    }
  }
</script>

<style scoped>

</style>

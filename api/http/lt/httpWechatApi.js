import axios from 'axios'

let base = '/api/c'

export const httpWechatApi = {
  getConfig(shortId, url) {
    return axios.get(`${base}/${shortId}/wechat/config`, {
      params: {
        url: url
      }
    }).then(res => res.data)
  }
}

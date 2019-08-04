import axios from 'axios'

let base = '/api/b'

export const httpConfigAdminApi = {
  getConfigWechat(shortId) {
    return axios.get(`${base}/${shortId}/config/wechat`).then(res => res.data)
  },
  putConfigWechat(shortId, model) {
    return axios.get(`${base}/${shortId}/config/wechat`, model).then(res => res.data)
  }
}

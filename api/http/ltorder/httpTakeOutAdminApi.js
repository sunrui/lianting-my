import axios from 'axios'

let base = '/api/b'

export const httpTakeoutAdminApi = {
  getConfig(shortId) {
    return axios.get(`${base}/${shortId}/takeout/config`).then(res => res.data)
  },
  putConfig(shortId, takeoutConfig) {
    return axios.put(`${base}/${shortId}/takeout/config`, takeoutConfig).then(res => res.data)
  }
}

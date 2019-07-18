import axios from 'axios'

let base = '/api/b'

export const httpPrinterAdminApi = {
  getConfig(shortId) {
    return axios.get(`${base}/${shortId}/printer/config`).then(res => res.data)
  },
  putConfig(shortId, printerConfig) {
    return axios.put(`${base}/${shortId}/printer/config`, printerConfig).then(res => res.data)
  },
  getStatus(shortId) {
    return axios.get(`${base}/${shortId}/printer/status`).then(res => res.data)
  },
  postReceipt(shortId, orderOneIds) {
    return axios.post(`${base}/${shortId}/printer/receipt`, orderOneIds).then(res => res.data)
  }
}

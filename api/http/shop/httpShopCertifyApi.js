import axios from 'axios'

let base = '/api/shop/one'

export const httpShopCertifyApi = {
  put(shortId, shopCertify) {
    return axios.put(`${base}/${shortId}/certify`, shopCertify).then(res => res.data)
  },
  get(shortId) {
    return axios.get(`${base}/${shortId}/certify`).then(res => res.data)
  },
  getResult(shortId) {
    return axios.get(`${base}/${shortId}/certify/result`).then(res => res.data)
  }
}

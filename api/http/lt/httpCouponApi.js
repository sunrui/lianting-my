import axios from 'axios'

let base = '/api/c'

export const httpCouponApi = {
  getFetch(shortId) {
    return axios.get(`${base}/${shortId}/coupon/fetch`).then(res => res.data)
  },
  post(shortId, couponId) {
    return axios.post(`${base}/${shortId}/coupon/${couponId}`).then(res => res.data)
  },
  getAll(shortId, page, size) {
    return axios.get(`${base}/${shortId}/coupon`, {
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  }
}

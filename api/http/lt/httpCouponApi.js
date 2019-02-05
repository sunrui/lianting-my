import axios from 'axios'

let base = '/api/c'

export const httpCouponApi = {
  getCoupon(shortId) {
    return axios.get(`${base}/${shortId}/coupon/coupon`).then(res => res.data)
  },
  postCouponUser(shortId, couponId) {
    return axios.post(`${base}/${shortId}/coupon/coupon/${couponId}/user`).then(res => res.data)
  },
  getCouponUser(shortId, valid, page, size) {
    return axios.get(`${base}/${shortId}/coupon/user`, {
      params: {
        valid: valid,
        page: page,
        size: size
      }
    }).then(res => res.data)
  }
}

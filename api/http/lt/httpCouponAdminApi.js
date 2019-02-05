import axios from 'axios'

let base = '/api/b'

export const httpCouponAdminApi = {
  getCoupon(shortId, page, size) {
    return axios.get(`${base}/${shortId}/coupon/coupon`, {
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  postCoupon(shortId, coupon) {
    return axios.post(`${base}/${shortId}/coupon/coupon`, coupon).then(res => res.data)
  },
  deleteCoupon(shortId, couponId) {
    return axios.delete(`${base}/${shortId}/coupon/coupon/${couponId}`).then(res => res.data)
  },
  putCouponEnable(shortId, couponId, enable) {
    return axios.put(`${base}/${shortId}/coupon/coupon/${couponId}/enable`, {
      enable: enable
    }).then(res => res.data)
  }
}

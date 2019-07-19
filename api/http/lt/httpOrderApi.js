import axios from 'axios'

let base = '/api/c'

export const httpOrderApi = {
  getAll(shortId, type, live, page, size) {
    return axios.get(`${base}/${shortId}/order`, {
      params: {
        live: live,
        type: type,
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  getAllByCaptchaTableId(shortId, captchaTableId, page, size) {
    return axios.get(`${base}/${shortId}/order/captcha/${captchaTableId}`, {
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  postOrder(shortId, model) {
    return axios.post(`${base}/${shortId}/order`, model).then(res => res.data)
  },
  postOrderFood(shortId, orderOneId, model) {
    return axios.post(`${base}/${shortId}/order/${orderOneId}/food`, model).then(res => res.data)
  },
  getOrder(shortId, orderOneId) {
    return axios.get(`${base}/${shortId}/order/${orderOneId}`).then(res => res.data)
  },
  getConfig(shortId) {
    return axios.get(`${base}/${shortId}/order/config`).then(res => res.data)
  },
  postCoupon(shortId, citusOrderId, couponUserId) {
    return axios.post(`${base}/${shortId}/order/${citusOrderId}/coupon`, {
      couponUserId: couponUserId
    }).then(res => res.data)
  },
  postPay(shortId, citusOrderId, unifiedPayWay) {
    return axios.post(`${base}/${shortId}/order/${citusOrderId}/pay`, {
      unifiedPayWay: unifiedPayWay
    }).then(res => res.data)
  },
  putCancel(shortId, orderOneId, remark) {
    return axios.put(`${base}/${shortId}/order/${orderOneId}/cancel`, {
      remark: remark
    }).then(res => res.data)
  },
}

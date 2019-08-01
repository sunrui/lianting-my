import axios from 'axios/index'

let base = '/api/shop/license'

export const httpLicenseApi = {
  getAll(shortId, page, size) {
    return axios.get(`${base}`, {
      params: {
        shortId: shortId,
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  postOrder(shortId, shopLicensePlanId, year, unifiedPayWay) {
    return axios.post(`${base}/order`, {
      shortId: shortId,
      shopLicensePlanId: shopLicensePlanId,
      year: year,
      unifiedPayWay: unifiedPayWay
    }).then(res => res.data)
  },
  postUpgrade(shortId, model) {
    return axios.post(`${base}/upgrade`, model).then(res => res.data)
  },
  postDowngrade(shortId, model) {
    return axios.post(`${base}/downgrade`, model).then(res => res.data)
  },
  getOrder(shopLicenseOrderId) {
    return axios.get(`${base}/order/${shopLicenseOrderId}`).then(res => res.data)
  },
  getPlanAll(page, size) {
    return axios.get(`${base}/plan`, {
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  }
}

import axios from 'axios'

let base = '/api/shop/license'

export const httpShopLicenseApi = {
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
  postOrderTest(shortId, shopLicensePlanId, year, unifiedPayWay) {
    return axios.post(`${base}/order/test`, {
      shortId: shortId,
      shopLicensePlanId: shopLicensePlanId,
      year: year,
      unifiedPayWay: unifiedPayWay
    }).then(res => res.data)
  },
  getOrder(shopLicenseOrderId) {
    return axios.get(`${base}/order/${shopLicenseOrderId}`).then(res => res.data)
  },
  getPlanAll(type, page, size) {
    return axios.get(`${base}/plan`, {
      params: {
        type: type,
        page: page,
        size: size
      }
    }).then(res => res.data)
  }
}

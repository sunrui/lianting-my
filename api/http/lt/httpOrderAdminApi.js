import axios from "axios"

let base = "/api/b"

export const httpOrderAdminApi = {
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
  putConfig(shortId, orderPay) {
    return axios.put(`${base}/${shortId}/order/config`, orderPay).then(res => res.data)
  },
  getAllByTableOneId(shortId, tableOneId, live, page, size) {
    return axios.get(`${base}/${shortId}/order`, {
      params: {
        type: 'ForHere',
        tableOneId: tableOneId,
        live: live,
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  getAllByDate(shortId, type, timeStamp, page, size) {
    return axios.get(`${base}/${shortId}/order`, {
      params: {
        type: type,
        timeStamp: timeStamp,
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  getAllByUserId(shortId, type, userId, live, page, size) {
    return axios.get(`${base}/${shortId}/order`, {
      params: {
        type: type,
        userId: userId,
        live: live,
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  putPeople(shortId, orderOneId, people) {
    return axios.put(`${base}/${shortId}/order/${orderOneId}/people`, {
      people: people
    }).then(res => res.data)
  },
  putPrice(shortId, orderOneId, model) {
    return axios.put(`${base}/${shortId}/order/${orderOneId}/price`, model).then(res => res.data)
  },
  putPriceTableware(shortId, orderOneId, model) {
    return axios.put(`${base}/${shortId}/order/${orderOneId}/priceTableware`, model).then(res => res.data)
  },
  putRemark(shortId, orderOneId, remark) {
    return axios.put(`${base}/${shortId}/order/${orderOneId}/remark`, {
      remark: remark
    }).then(res => res.data)
  },
  putCancel(shortId, orderOneId, reason) {
    return axios.put(`${base}/${shortId}/order/${orderOneId}/cancel`, {
      reason: reason
    }).then(res => res.data)
  },
  postRefund(shortId, orderOneId, reason) {
    return axios.post(`${base}/${shortId}/order/${orderOneId}/refund`, {
      reason: reason
    }).then(res => res.data)
  },
  putReturn(shortId, orderOneId, model) {
    return axios.put(`${base}/${shortId}/order/${orderOneId}/return`, model).then(res => res.data)
  },
  putTable(shortId, orderOneId, tableOneId) {
    return axios.put(`${base}/${shortId}/order/${orderOneId}/table`, {
      tableOneId: tableOneId
    }).then(res => res.data)
  },
  putPayOffline(shortId, orderOneId, remark) {
    return axios.put(`${base}/${shortId}/order/${orderOneId}/offline`, {
      remark: remark
    }).then(res => res.data)
  },
  putFoodStatus(shortId, orderOneId, orderFoodId, status) {
    return axios.put(`${base}/${shortId}/order/${orderOneId}/food/status`, {
      orderFoodId: orderFoodId,
      status: status
    }).then(res => res.data)
  }
}

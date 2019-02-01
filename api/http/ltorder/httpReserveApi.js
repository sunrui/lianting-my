import axios from 'axios'

let base = '/api/c'

export const httpReserveApi = {
  getState(shortId) {
    return axios.get(`${base}/${shortId}/reserve/state`).then(res => res.data)
  },
  getAll(shortId, statuses, timeStamp, page, size) {
    return axios.get(`${base}/${shortId}/reserve`, {
      params: {
        statuses: statuses,
        timeStamp: timeStamp,
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  getOne(shortId, reserveId) {
    return axios.get(`${base}/${shortId}/reserve/${reserveId}`).then(res => res.data)
  },
  post(shortId, model) {
    return axios.post(`${base}/${shortId}/reserve`, model).then(res => res.data)
  },
  putRead(shortId, reserveId) {
    return axios.put(`${base}/${shortId}/reserve/${reserveId}/read`).then(res => res.data)
  },
  putCancel(shortId, reserveId, reason) {
    return axios.put(`${base}/${shortId}/reserve/${reserveId}/cancel`, {
      reason: reason
    }).then(res => res.data)
  }
}

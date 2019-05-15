import axios from 'axios'

let base = '/api/c'

export const httpQueueApi = {
  getLive(shortId, page, size) {
    return axios.get(`${base}/${shortId}/queue/live`, {
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  getAll(shortId, page, size) {
    return axios.get(`${base}/${shortId}/queue`, {
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  getHistory(shortId, page, size) {
    return axios.get(`${base}/${shortId}/queue/history`, {
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  getState(shortId) {
    return axios.get(`${base}/${shortId}/queue/state`).then(res => res.data)
  },
  putCancel(shortId, queueTicketId) {
    return axios.put(`${base}/${shortId}/queue/cancel`, {
      queueTicketId: queueTicketId
    }).then(res => res.data)
  },
  getNowOne(shortId, tableGroupId) {
    return axios.get(`${base}/${shortId}/queue/now`, {
      params: {
        tableGroupId: tableGroupId
      }
    }).then(res => res.data)
  },
  getNowAll(shortId, page, size) {
    return axios.get(`${base}/${shortId}/queue/now`, {
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  postOne(shortId, model) {
    return axios.post(`${base}/${shortId}/queue/one`, model).then(res => res.data)
  }
}

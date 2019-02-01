import axios from 'axios'

let base = '/api/b'

export const httpReserveAdminApi = {
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
  getDay(shortId, timeStamp, page, size) {
    return axios.get(`${base}/${shortId}/reserve/day`, {
      params: {
        timeStamp: timeStamp,
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  putState(shortId, model) {
    return axios.put(`${base}/${shortId}/reserve/state`, model).then(res => res.data)
  },
  putReply(shortId, reserveId, model) {
    return axios.put(`${base}/${shortId}/reserve/${reserveId}/reply`, model).then(res => res.data)
  }
}

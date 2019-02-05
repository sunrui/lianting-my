import axios from 'axios'

let base = '/api/b'

export const httpQueueAdminApi = {
  postNext(shortId, tableGroupId) {
    return axios.post(`${base}/${shortId}/queue/next`, {
      tableGroupId: tableGroupId
    }).then(res => res.data)
  },
  postReset(shortId, tableGroupId, sequenceStart) {
    return axios.post(`${base}/${shortId}/queue/reset`, {
      tableGroupId: tableGroupId,
      sequenceStart: sequenceStart
    }).then(res => res.data)
  },
  putState(shortId, queueState) {
    return axios.put(`${base}/${shortId}/queue/state`, queueState).then(res => res.data)
  }
}

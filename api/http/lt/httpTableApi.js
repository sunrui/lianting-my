import axios from 'axios'

let base = '/api/c'

export const httpTableApi = {
  getGroupAll(shortId) {
    return axios.get(`${base}/${shortId}/table/group`).then(res => res.data)
  },
  getGroupOne(shortId, tableGroupId) {
    return axios.get(`${base}/${shortId}/table/group/${tableGroupId}`).then(res => res.data)
  },
  getTable(shortId, tableOneId) {
    return axios.get(`${base}/${shortId}/table/one/${tableOneId}`).then(res => res.data)
  },
  getTableAll(shortId, tableGroupId) {
    return axios.get(`${base}/${shortId}/table`, {
      params: {
        tableGroupId: tableGroupId
      }
    }).then(res => res.data)
  }
}

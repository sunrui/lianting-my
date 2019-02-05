import axios from 'axios'

let base = '/api/b'

export const httpTableAdminApi = {
  postGroup(shortId, tableGroup) {
    return axios.post(`${base}/${shortId}/table/group`, tableGroup).then(res => res.data)
  },
  putGroup(shortId, tableGroup) {
    return axios.put(`${base}/${shortId}/table/group/${tableGroup.id}`, tableGroup).then(res => res.data)
  },
  deleteGroup(shortId, tableGroupId) {
    return axios.delete(`${base}/${shortId}/table/group/${tableGroupId}`).then(res => res.data)
  },
  postTable(shortId, table) {
    return axios.post(`${base}/${shortId}/table/table`, table).then(res => res.data)
  },
  deleteTable(shortId, tableOneId) {
    return axios.delete(`${base}/${shortId}/table/table/${tableOneId}`).then(res => res.data)
  }
}

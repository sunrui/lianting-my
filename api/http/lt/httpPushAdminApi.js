import axios from 'axios'

let base = '/api/b'

export const httpPushAdminApi = {
  get(shortId, roleType) {
    return axios.get(`${base}/${shortId}/push`, {
      params: {
        roleType: roleType
      }
    }).then(res => res.data)
  },
  put(shortId, rolePush) {
    return axios.put(`${base}/${shortId}/push`, rolePush).then(res => res.data)
  },
  getTemplate(shortId) {
    return axios.get(`${base}/${shortId}/push/template`).then(res => res.data)
  },
  putTemplate(shortId, pushTemplate) {
    return axios.put(`${base}/${shortId}/push/template`, pushTemplate).then(res => res.data)
  }
}

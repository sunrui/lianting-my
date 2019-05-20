import axios from 'axios'

let base = '/api/b'

export const httpRoleAdminApi = {
  postRoleCaptcha(shortId, roleType) {
    return axios.post(`${base}/${shortId}/role/captcha`, {
      roleType: roleType
    }).then(res => res.data)
  },
  getAll(shortId) {
    return axios.get(`${base}/${shortId}/role`).then(res => res.data)
  },
  postRole(shortId, role) {
    return axios.post(`${base}/${shortId}/role`, role).then(res => res.data)
  },
  deleteRole(shortId, roleId) {
    return axios.delete(`${base}/${shortId}/role/${roleId}`).then(res => res.data)
  }
}

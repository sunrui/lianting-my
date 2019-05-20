import axios from 'axios'


export const httpRoleApi = {
  postRole(shortId, captchaId, name) {
    let base = '/api/c'
    return axios.post(`${base}/${shortId}/role/${captchaId}`, {
      name: name
    }).then(res => res.data)
  },
  getAll(page, size) {
    let base = '/api/role'

    return axios.get(`${base}`, {
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  }
}

import axios from 'axios'

let base = '/api/role'

export const httpRoleApi = {
  getAll(page, size) {
    return axios.get(`${base}`, {
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  }
}

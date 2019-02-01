import axios from 'axios'

let base = '/api/c'

export const httpWallApi = {
  getMyAll(shortId, page, size) {
    return axios.get(`${base}/${shortId}/wall/i`, {
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  getAll(shortId, page, size) {
    return axios.get(`${base}/${shortId}/wall`, {
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  getOne(shortId, wallId) {
    return axios.get(`${base}/${shortId}/wall/${wallId}`).then(res => res.data)
  },
  getReplyAll(shortId, wallId, page, size) {
    return axios.get(`${base}/${shortId}/wall/${wallId}/reply`, {
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  putWall(shortId, model) {
    return axios.put(`${base}/${shortId}/wall`, model).then(res => res.data)
  },
  postReply(shortId, wallId, message) {
    return axios.post(`${base}/${shortId}/wall/${wallId}/reply`, {
      message: message
    }).then(res => res.data)
  }
}

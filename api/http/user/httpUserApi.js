import axios from 'axios'

let base = '/api/user'

let maxAge = 365 * 24 * 60 * 60

export const httpUserApi = {
  getInfo(userId) {
    return axios.get(`${base}/info`, {
      params: {
        userId: userId
      }
    }).then(res => res.data)
  },
  putInfo(model) {
    return axios.put(`${base}/info`, model).then(res => res.data)
  },
  // postRegister(shortId, userName, password) {
  //   return axios.post(`${base}/register`, {
  //     shortId: shortId,
  //     userName: userName,
  //     password: passwords
  //   }).then(res => res.data)
  // },
  postLoginWechat(shortId, code, state) {
    return axios.post(`${base}/login/wechat`, {
      shortId: shortId,
      code: code,
      state: state,
      maxAge: maxAge
    }).then(res => res.data)
  },
  postLoginPhone(shortId, phone, code) {
    return axios.post(`${base}/login/phone`, {
      shortId: shortId,
      phone: phone,
      code: code,
      maxAge: maxAge
    }).then(res => res.data)
  },
  postLoginPassword(shortId, userName, password) {
    return axios.post(`${base}/login/password`, {
      shortId: shortId,
      userName: userName,
      password: password,
      maxAge: maxAge
    }).then(res => res.data)
  },
  postBindPhone(phone, code) {
    return axios.post(`${base}/bind/phone`, {
      phone: phone,
      code: code,
      maxAge: maxAge
    }).then(res => res.data)
  },
  getWechatInfo(shortId) {
    return axios.get(`${base}/wechat/info`, {
      params: {
        shortId: shortId
      }
    }).then(res => res.data)
  },
  postLogout() {
    return axios.post(`${base}/logout`).then(res => res.data)
  }
}

import axios from 'axios'

let base = '/api/c'

export const httpSearchApi = {
  getSearchWord(shortId) {
    return axios.get(`${base}/${shortId}/search/word`).then(res => res.data)
  }
}

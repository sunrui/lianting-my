import axios from 'axios'

let base = '/api/b'

export const httpSearchAdminApi = {
  putSearchWord(shortId, words) {
    return axios.put(`${base}/${shortId}/search/word`, {
      words: words
    }).then(res => res.data)
  }
}

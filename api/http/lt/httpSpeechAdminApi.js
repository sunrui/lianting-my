import axios from 'axios'

let base = '/api/b'

export const httpSpeechAdminApi = {
  getSpeechUrl(shortId, radioText) {
    return `${base}/${shortId}/speech?radioText=${radioText}`
  }
}

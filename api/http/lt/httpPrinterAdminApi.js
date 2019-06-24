import axios from 'axios'

let base = '/api/b'

export const httpPrinterAdminApi = {
  getPrinterFeie(shortId, page, size) {
    return axios.get(`${base}/${shortId}/printer/feie`, {
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  putPrinterFeie(shortId, printer) {
    return axios.put(`${base}/${shortId}/printer/feie`, printer).then(res => res.data)
  },
  deletePrinterFeie(shortId, printerFeieId) {
    return axios.delete(`${base}/${shortId}/printer/feie/${printerFeieId}`).then(res => res.data)
  },
  putPrinterFeieEnable(shortId, printerFeieId, enable) {
    return axios.put(`${base}/${shortId}/printer/feie/${printerFeieId}/enable`, {
      enable: enable
    }).then(res => res.data)
  }
}

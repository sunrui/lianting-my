import axios from 'axios'

let base = '/api/b'

export const httpPrinterYlyAdminApi = {
  getPrinter(shortId, page, size) {
    return axios.get(`${base}/${shortId}/printer/yly`, {
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  postPrinter(shortId, printer) {
    return axios.post(`${base}/${shortId}/printer/yly`, printer).then(res => res.data)
  },
  getPrinterStatus(shortId, printer) {
    return axios.put(`${base}/${shortId}/printer/yly/status`, printer).then(res => res.data)
  },
  getPrinterOneStatus(shortId, printerId) {
    return axios.put(`${base}/${shortId}/printer/yly/${printerId}/status`).then(res => res.data)
  },
  deletePrinter(shortId, printerId) {
    return axios.delete(`${base}/${shortId}/printer/yly/${printerId}`).then(res => res.data)
  },
  putPrinterEnable(shortId, printerId, enable) {
    return axios.put(`${base}/${shortId}/printer/yly/${printerId}/enable`, {
      enable: enable
    }).then(res => res.data)
  }
}

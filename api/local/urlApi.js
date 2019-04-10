export const urlApi = {
  getCurrentUrl() {
    let url = null

    if (window.__wxjs_is_wkwebview) {
      url = window.entryUrl
    }

    if (!url) {
      url = location.href.split('#')[0]
    }

    return url
  }
}
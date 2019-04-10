export default ({app}) => {
  app.router.afterEach((to, from) => {
    if (window.__wxjs_is_wkwebview) {
      if (window.entryUrl === '' || window.entryUrl === undefined) {
        window.entryUrl = document.location.protocol + '//' + window.location.host + to.fullPath
      }
    }
  })
}
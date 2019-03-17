if (process.env.NODE_ENV === 'production') {
  let url = window.location.href
  if (document.location.protocol === 'http:') {
    url = url.replace('http:', 'https:')
    window.location.replace(url)
  }
}
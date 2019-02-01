export const scrollApi = {
  enable(enable) {
    let mo = function(e) {
      e.preventDefault()
    }

    if (enable) {
      document.body.style.overflow = ''
      document.removeEventListener('touchmove', mo, false)
    } else {
      document.body.style.overflow = 'hidden'
      document.addEventListener('touchmove', mo, false)
    }
  }
}

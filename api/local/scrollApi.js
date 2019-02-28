export const scrollApi = {
  enable(enable) {
    let mo = function (e) {
      e.preventDefault()
    }

    if (enable) {
      document.body.style.overflow = ''
      document.removeEventListener('touchmove', mo, false)
    } else {
      document.body.style.overflow = 'hidden'
      document.addEventListener('touchmove', mo, false)
    }
  },
  getCurrentY() {
    return document.documentElement.scrollTop || document.body.scrollTop
  },
  scrollAnimation(currentY, targetY) {
    let needScrollTop = targetY - currentY
    let _currentY = currentY
    setTimeout(() => {
      _currentY += Math.ceil(needScrollTop / 10)
      window.scrollTo(0, currentY)
      if (needScrollTop > 10 || needScrollTop < -10) {
        this.scrollAnimation(_currentY, targetY)
      } else {
        window.scrollTo(0, targetY)
      }
    }, 1)
  }
}

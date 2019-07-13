(function(win) {
  let remCalc = {}
  let docEl = win.document.documentElement, tid

  function refreshRem() {
    let width = docEl.getBoundingClientRect().width
    if (width > 750) {
      width = 750
    }
    let rem = width / 750 * 100
    docEl.style.fontSize = rem + 'px'
    remCalc.rem = rem
    let actualSize = parseFloat(window.getComputedStyle(document.documentElement)['font-size'])
    if (actualSize !== rem && actualSize > 0 && Math.abs(actualSize - rem) > 1) {
      let remScaled = rem * rem / actualSize
      docEl.style.fontSize = remScaled + 'px'
    }
  }

  function dbcRefresh() {
    clearTimeout(tid)
    tid = setTimeout(refreshRem, 1)
  }

  win.addEventListener('resize', function() {
    dbcRefresh()
  }, false)

  win.addEventListener('pageshow', function(e) {
    if (e.persisted) {
      dbcRefresh()
    }
  }, false)

  refreshRem()

  remCalc.refreshRem = refreshRem
  remCalc.rem2px = function(d) {
    let val = parseFloat(d) * this.rem
    if (typeof d === 'string' && d.match(/rem$/)) {
      val += 'px'
    }
    return val
  }
  remCalc.px2rem = function(d) {
    let val = parseFloat(d) / this.rem
    if (typeof d === 'string' && d.match(/px$/)) {
      val += 'rem'
    }
    return val
  }

  win.remCalc = remCalc
})(window)

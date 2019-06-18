if (process.env.NODE_ENV !== 'development') {
  var _hmt = _hmt || [];
  (function () {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?a919c3274d8c4eca1d261a8dac6d2776";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  })();

  (function (b, a, e, h, f, c, g, s) {
    b[h] = b[h] || function () {
      (b[h].c = b[h].c || []).push(arguments)
    }
    b[h].s = !!c
    g = a.getElementsByTagName(e)[0]
    s = a.createElement(e)
    s.src = '//s.union.360.cn/' + f + '.js'
    s.defer = !0
    s.async = !0
    g.parentNode.insertBefore(s, g)
  })(window, document, 'script', '_qha', 307528, false)
}

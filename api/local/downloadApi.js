export const downloadApi = {
  download(canvas, fileName) {
    let type = 'png'
    let imgData = canvas.toDataURL(type)

    let _fixType = function(type) {
      type = type.toLowerCase().replace(/jpg/i, 'jpeg')
      let r = type.match(/png|jpeg|bmp|gif/)[0]
      return 'image/' + r
    }

    imgData = imgData.replace(_fixType(type), 'image/octet-stream')

    let saveFile = function(data, filename) {
      let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
      save_link.href = data
      save_link.download = filename

      let event = document.createEvent('MouseEvents')
      event.initMouseEvent('click', true, false, window,
        0, 0, 0, 0, 0,
        false, false, false, false,
        0, null)
      save_link.dispatchEvent(event)
    }

    let filename = fileName + '.' + type
    saveFile(imgData, filename)
  }
}

module.exports = reqHanler

function reqHanler(req, resp) {

  let { url } = req

  if (url=='/') url = '/spamain.html'

  fs.readFile('public'+url, (err, data)=> {
    if (err) return resp.end(url+' is unavailable')

    const ext = url.match(/\.(\w+)$/),
          type = ext? {
            html: 'text/html',
            json: 'application/json',
            css: 'text/css',
            js: 'application/javascript',
          }[ext[1]] : ''
    if (ext) resp.setHeader('Content-Type', type)

    resp.end(data)
  })
}

const fs = require('fs')
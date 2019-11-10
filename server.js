
const port = process.env.PORT || 3000

require('http').createServer(reqHanler).listen(port,
  ()=> console.log('Server started on port '+port))

function reqHanler(req, resp) {
  resp.end('You tried to reach '+req.url)
}


const port = process.env.PORT || 3000

require('http').createServer(reqHanler).listen(port,
  ()=> console.log('Server started on port '+port))

function reqHanler(req, resp) {
  require('./reqhandler.js')(req, resp)
  if (!process.env.PORT) try {
    delete require.cache[require.resolve('./reqhandler.js')]
  } catch {}
}


const port = process.env.PORT || 3000

require('http').createServer(reqHandler).listen(port,
  ()=> console.log('Server started on port '+port))

if (!process.env.PORT) var reqHandler = (req, resp)=> {
  require('./reqhandler.js')(req, resp)
  try {delete require.cache[require.resolve('./reqhandler.js')] } catch {}
} else var reqHandler = require('./reqhandler.js')


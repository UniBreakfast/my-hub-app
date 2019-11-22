
const port = process.env.PORT || 3000


if (process.env.PORT)
  var reqHandler = require('./reqhandler.js')
else
  var reqHandler = (req, resp)=> {
    require('./reqhandler.js')(req, resp)
    delete require.cache[require.resolve('./reqhandler.js')]
  }


require('http').createServer(reqHandler).listen(port,
  ()=> console.log('Server started on port '+port))


module.exports = reqHanler

function reqHanler(req, resp) {

  resp.end('You tried to reach '+req.url)

}
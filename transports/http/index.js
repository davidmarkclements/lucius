var request = require('xhr-request')
var p2rx = require('path-to-regexp')

var api = '/api/:role/:cmd'

module.exports = function (opts) {
  var remote = 'api' in opts ? opts.api : api
  if (!remote) { return }
  remote = remote && p2rx.compile(remote)
  return function act(args, cb) {
    var get = args.$get || opts.get
    if (args.$post) { get = false }
    request(remote(args), 
      get ? {json: true} : {method: 'POST', json: true, body: args},
      function (err, data, res) {
        if (err) { 
          cb && cb(err) 
          return
        }
        if (+(res.statusCode + '')[0] > 3) {
          var msg = res.rawRequest.responseText ? 
            res.rawRequest.statusText + ' ' + res.rawRequest.responseText : 
            res.rawRequest.statusText
          var e = Error(msg)
          e.msg = msg
          e.code = res.statusCode
          e.error = res.rawRequest.statusText
          cb && cb(e)
          return
        }
        cb && cb(null, data)
      }
    )
  }
}
var bloomrun = require('bloomrun')
var request = require('xhr-request')
var p2rx = require('path-to-regexp')
var bloom = bloomrun()

var api = '/api/:role/:cmd'

function lucius(opts) {
  opts = opts || {}
  var remote = 'api' in opts ? opts.api : api
  remote = remote && p2rx.compile(remote)

  return {
    add: add,
    act: act
  }

  function add(pattern, fn) {
    bloom.add(pattern, fn)
  }
  
  function act(args, cb) {
    var match = bloom.lookup(args)
    var get = args.$get || opts.get
    if (args.$post) { get = false }

    if (!match) {
      if (!remote) {
        cb && cb(Error('no matching pattern'))  
        return 
      }
      request(remote(args), 
        get ? {json: true} : {method: 'POST', json: true, body: args},
      cb)
      return 
    }
    if (!(match instanceof Function)) {
      cb && cb(Error('pattern matches non-function'))
      return 
    }
    match(args, cb || function (err) {
      if (err) { 
        console.error('Seneca error: ', err) 
      }
    })
  }
}

module.exports = lucius
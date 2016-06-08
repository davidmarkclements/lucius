var local = require('./transports/local')
var http = require('./transports/http')

function lucius(opts) {
  opts = opts || {}

  var transports = [local(opts), http(opts)].filter(Boolean)
  var adders = transports.filter(function (t) { return t.add })

  return {
    add: add,
    act: act,
    use: use
  }

  function add(pattern, fn) {
    adders.forEach(function (t) { 
      t.add(pattern, fn)
    })
    return this
  }
  
  function act(args, cb) {
    var t = 0
    var errs = []
    function enact() {
      if (!transports[t]) {
        var e = Error('no matching pattern')
        e.code = 404
        e.msg = 'no matching pattern'
        e.errors = errs
        cb(e)
        return
      }
      transports[t](args, function (err, res) {
        if (err && err.code >= 400) {
          errs.push(err)
          t += 1
          enact()
          return
        }
        cb(err, res)
      })
    }
    enact()
    return this
  }

  function use (t) {
    if (!(t instanceof Function)) {
      throw Error('transport must be a function')
    }
    transports.push(t)
    return this
  }
}
module.exports = lucius
var bloomrun = require('bloomrun')
var bloom = bloomrun()

module.exports = function (opts) {
  act.add = add
  return act

  function add(pattern, fn) {
    bloom.add(pattern, fn)
  }

  function act(args, cb) {
    var match = bloom.list(args).pop()
    var err
    if (!match) {
      err = Error('no matching pattern')
      err.code = 404
      cb && cb(err)
      return
    }

    if (!(match instanceof Function)) {      
      err = Error('no matching pattern')
      err.code = 400
      cb && cb(err)
      return 
    }
    match(args, cb || function (err) {
      if (err) { 
        console.error('Seneca error: ', err) 
      }
    })
  }
}
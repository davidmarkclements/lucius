if (!global.Polymer || !global.Polymer.Base) { 
  throw Error('Polymer needs to be a global') 
}
var lucius = require('./')
var assign = require('object-assign')
assign(Polymer.Base, lucius({get: true}))

module.exports = lucius

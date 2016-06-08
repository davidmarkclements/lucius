# Lucius

[Seneca](http://npm.im/seneca) Microservices in the Browser

## Status - Experimental

## API

### Instantiation

Call `lucius` to get a [Seneca](http://npm.im/seneca)-like instance

```js
lucius({get: false, api: '/api/:role/:cmd', local: true}) => {act, add, use}
```

### Options

* `get`: remote requests to made with GET, instead of POST, default: `false`
* `api`: remote endpoint, where placeholder params correspond to pattern keys, default '/api/:role/:cmd'. Set to `false` to disable remote lookups.
* `local`: look for patterns registered browser-side, set to `false` to only make remote queries, default: `true`

### Methods

#### `add`

```js
seneca.add(pattern, handler)
```

Registers a pattern that will be matched **browser-side only**

#### `act`

```js
seneca.act(args, cb)
```

Triggers an action that will first match against any registered
browser side patterns (as registered with `add`), then may hit
a server endpoint as defined by the `api` option. 

#### `use`

Register a transport, see [Transports](#transports-advanced)

### Special Patterns


#### `$get: true`

```js
seneca.act({$get: true}, cb)
```

In cases where a server endpoint is hit (see `api` option and `seneca.act`), 
adding `$get: true` to the input args will force the request to be made via GET,
and the args will **not** be sent to the server.


#### `$post: true`

```js
seneca.act({$post: true}, cb)
```

In cases where a server endpoint is hit (see `api` option and `seneca.act`), 
adding `$get: true` to the input args will force the request to be made via POST,
and the args **will** be sent to the server.

By default all requests are POST requests, this is only necessary when
the instance was created with the `get` option set to `true`.


### Transports (advanced)

Custom transports open up a whole load of possibilities, for instance WebSockets, WebRTC data channels, engine.io, optimized multiplexing over long-polling HTTP, using WebWorkers in some awesome way, and so forth.

In Lucius a transport is conceptually a middleware function, which is registered with the `use` function.

```js
lucius().use((args, cb) => cb(err, response))
```

The responsibility of the function is to lookup the pattern supplied by args,
and then call the callback with a response. 

If there is no match, an error object should be supplied with a `code` property
of `400` and above. For instance: 

```js
function transport(args, cb) {
  customLookup(args, function (err, response) {
    if (err) { return cb(err) }
    if (!response) { //no match!
      err = Error('no matching pattern')
      err.code = 404
      cb && cb(err)
      return
    }
    cb(null, response)
  })
}
```

Internally, Lucius has two transports `local` and `http`, if there are no `local` patterns `http` will be checked (providing `api` isn't `false`). 

Once the internal transports are checked, if no pattern has been found custom transports will then be checked in order of registration.

The transport can also have a static `add` method attached to it,

```js
function myTransport(args, cb) { /* ... etc ... */ }
myTransport.add = function (pattern, fn) {
  registerPatternToRemotePlace(pattern, fn)
}
```

In a server-client scenario there's little need for this behaviour, in fact it's probably a really bad idea. However, in a client-side p2p situation this could be quite important.


## License

MIT

## Acknowledgements

* Sponsored by nearForm



# Lucius

Seneca Microservices in the Browser

## Status - Experimental

## API

### Instantiation

Call `lucius` to get a Seneca-like instance

```js
lucius({get: false, remote: '/api/:role/:cmd'}) => {act, add}
```

### Options

* `get`: remote requests to made with GET method, default: `false`
* `remote`: remote endpoint, where placeholder params correspond to pattern keys, default '/api/:role/:cmd'. Set to `false` to disable remote behaviour.

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
a server endpoint as defined by the `remote` option. 

### Special Patterns


#### `$get: true`

```js
seneca.act({$get: true}, cb)
```

In cases where a server endpoint is hit (see `remote` option and `seneca.act`), 
adding `$get: true` to the input args will force the request to be made via GET,
and the args will **not** be sent to the server.


#### `$post: true`

```js
seneca.act({$post: true}, cb)
```

In cases where a server endpoint is hit (see `remote` option and `seneca.act`), 
adding `$get: true` to the input args will force the request to be made via POST,
and the args **will** be sent to the server.

By default all requests are POST requests, this is only necessary when
the instance was created with the `get` option set to `true`.


## License

MIT

## Acknowledgements

* Sponsored by nearForm



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

### `add`

```js
seneca.add(pattern, handler)
```

Registers a pattern that will be matched **browser-side only**

### `act`

```js
seneca.act(args, cb)
```

Triggers an action that will first match against any registered
browser side patterns (as registered with `add`), then may hit
a server endpoint as defined by the `remote` option. 

## License

MIT

## Acknowledgements

* Sponsored by nearForm



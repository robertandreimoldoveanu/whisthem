# debug - control debug flows with ease

Set the debug mode

```js
DPN.setDebugMode(environment.development); // since you want this on just for development
```

Start a debug flow

```js
DPN.start('my-debug-flow');
```

Then open that flow with the `debug` function or, if you're debugging a RxJS stream, with `checkpoint`

```js
DPN.debug('my-debug-flow');
source.pipe(
    filter(...),
    DPN.checkpoint('my-debug-flow'),
    switchMap(...),
)
```

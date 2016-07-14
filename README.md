# astepback
[koa](https://github.com/koajs/koa) middleware that stores exactly one previous page for further redirection.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![npm download][download-image]][download-url]
[![dependencies][david-image]][david-image]

[npm-image]: https://img.shields.io/npm/v/astepback.svg?style=flat-square
[npm-url]: https://npmjs.org/package/astepback
[david-image]: https://david-dm.org/HeavenDuke/astepback.svg
[travis-image]: https://travis-ci.org/HeavenDuke/astepback.svg
[travis-url]: https://travis-ci.org/HeavenDuke/astepback
[download-image]: https://img.shields.io/npm/dm/astepback.svg?style=flat-square
[download-url]: https://npmjs.org/package/astepback

## Install
```shell
npm install astepback
```

## dependencies
[Koa 2(Node >= 0.12.0)](https://github.com/koajs/koa)  
[koa-session](https://github.com/koajs/session)


## Configuration
```javascript
var server = koa();
server.use(bodyParser());
server.use(session(server));
server.keys = ['heavenduke'];
server.use(asb());
```

## Usage
```javascript
server.get('/previous', function *(next) {
    // store current url into asb object.
    this.asb = this.request.url;
    this.body = {title: "previous"};
});

server.get('/current', function *(next) {
    // redirect to stored previous path.
    this.redirect(this.asb);
});
```

## Notice
The default value of this.asb is ```/``` which is usually the default path and use ```session['koa-asb']``` as default storage, you can reset the session key through the following method:
```javascript
server.use(asb({key: "foo"));
```

## License
[MIT](https://github.com/HeavenDuke/astepback/blob/master/LICENSE)
# astepback
[koa](https://github.com/koajs/koa) middleware that stores exactly one previous page for further redirection.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![npm download][download-image]][download-url]
[![dependencies][david-image]][david-image]
[![Coverage Status][coverage-image]][coverage-image]


[coverage-image]: https://coveralls.io/github/HeavenDuke/astepback
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
var asb = require('astepback');
var koa = require('koa');
var session = require('koa-session');
var bodyParser = require('koa-bodyparser');

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
The default value of this.asb is ```/``` which is usually the default path of a website, it also use ```session['koa-asb']``` as default storage, you can reset the default path and session key through the following method:
```javascript
server.use(asb({
    key: "foo",         // session storage key
    defaultPath: "/foo" // default redirection path
}));
```

## License
[MIT](https://github.com/HeavenDuke/astepback/blob/master/LICENSE)
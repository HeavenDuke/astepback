# astepback
Koa middleware that stores exactly one previous page for further redirection.

### Configuration
```javascript
var server = koa();
server.use(bodyParser());
server.use(session(server));
server.keys = ['heavenduke'];
server.use(asb());
```
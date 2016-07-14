/**
 * Created by Obscurity on 2016/5/8.
 */

var assert = require('assert');
var koa = require('koa');
var request = require('supertest');
var session = require('koa-session');
var bodyParser = require('koa-bodyparser');
var router = require('koa-router');
var asb = require('../');

describe('koa astepback middleware for koa 2.0', function () {

    describe('should redirect back', function () {
        it('without params', function (done) {
            var server = koa();
            server.use(bodyParser());
            server.use(session(server));
            server.keys = ['heavenduke'];
            server.use(asb());
            server.use(router(server));
            server.get('/previous', function *(next) {
                this.asb = this.request.url;
                this.body = {title: "previous"};
            });

            server.get('/current', function *(next) {
                this.redirect(this.asb);
            });

            var agent = request.agent(server.listen());
            agent.get('/previous')
                .send()
                .end(function (err, res) {
                    var cookieString = res.headers['set-cookie'] ? res.headers['set-cookie'].join(';') : null;
                    agent.get('/current')
                        .set("Cookie", cookieString)
                        .send()
                        .expect('location', '/previous').expect(302, done);
                });
        });

        it('with params', function (done) {
            var server = koa();
            server.use(bodyParser());
            server.use(session(server));
            server.keys = ['heavenduke'];
            server.use(asb());
            server.use(router(server));
            server.get('/previous', function *(next) {
                this.asb = this.request.url;
                this.body = {title: "previous"};
            });

            server.get('/current', function *(next) {
                this.redirect(this.asb);
            });

            var agent = request.agent(server.listen());
            agent.get('/previous?foo=bar')
                .send()
                .end(function (err, res) {
                    var cookieString = res.headers['set-cookie'] ? res.headers['set-cookie'].join(';') : null;
                    agent.get('/current')
                        .set("Cookie", cookieString)
                        .send()
                        .expect('location', '/previous?foo=bar').expect(302, done);
                });
        });

        it('to default url when url is not stored', function (done) {
            var server = koa();
            server.use(bodyParser());
            server.use(session(server));
            server.keys = ['heavenduke'];
            server.use(asb());
            server.use(router(server));

            server.get('/', function *(next) {
                this.body = {title: "basic"};
            });

            server.get('/previous', function *(next) {
                this.body = {title: "previous"};
            });

            server.get('/current', function *(next) {
                this.redirect(this.asb);
            });

            var agent = request.agent(server.listen());
            agent.get('/previous')
                .send()
                .end(function (err, res) {
                    var cookieString = res.headers['set-cookie'] ? res.headers['set-cookie'].join(';') : null;
                    agent.get('/current')
                        .set("Cookie", cookieString)
                        .send()
                        .expect('location', '/').expect(302, done);
                });
        });

        it('to customized default url when url is not stored', function (done) {
            var server = koa();
            server.use(bodyParser());
            server.use(session(server));
            server.keys = ['heavenduke'];
            server.use(asb({defaultPath: '/foo'}));
            server.use(router(server));

            server.get('/foo', function *(next) {
                this.body = {title: "basic"};
            });

            server.get('/previous', function *(next) {
                this.body = {title: "previous"};
            });

            server.get('/current', function *(next) {
                this.redirect(this.asb);
            });

            var agent = request.agent(server.listen());
            agent.get('/previous')
                .send()
                .end(function (err, res) {
                    var cookieString = res.headers['set-cookie'] ? res.headers['set-cookie'].join(';') : null;
                    agent.get('/current')
                        .set("Cookie", cookieString)
                        .send()
                        .expect('location', '/foo').expect(302, done);
                });
        });
    });

    describe('should save to session', function () {
        it ('with default key', function (done) {
            var server = koa();
            server.use(bodyParser());
            server.use(session(server));
            server.keys = ['heavenduke'];
            server.use(asb());
            server.use(router(server));
            server.get('/foo', function *(next) {
                this.asb = this.request.url;
                this.body = this.session;
            });

            var agent = request.agent(server.listen());
            agent.get('/foo')
                .send()
                .expect({'koa-asb': "/foo"})
                .expect(200, done);
        });

        it ('with customed key', function (done) {
            var server = koa();
            server.use(bodyParser());
            server.use(session(server));
            server.keys = ['heavenduke'];
            server.use(asb({key: 'foo'}));
            server.use(router(server));
            server.get('/foo', function *(next) {
                this.asb = this.request.url;
                this.body = this.session;
            });

            var agent = request.agent(server.listen());
            agent.get('/foo')
                .send()
                .expect({'foo': "/foo"})
                .expect(200, done);
        });
    });

    describe('should throw error', function () {
        it ('without koa session', function (done) {
            var server = koa();
            server.use(bodyParser());

            server.use(function *(next) {
                try{
                    yield* next;
                } catch(e) {
                    this.body = {error: e.message};
                }
            });

            server.use(asb());

            server.use(router(server));
            server.get('/foo', function *(next) {
                this.body = this.session;
            });

            var agent = request.agent(server.listen());
            agent.get('/foo')
                .send()
                .expect({error: 'astepback requires the koa-session middleware.'})
                .expect(200, done);
        });
    });

});
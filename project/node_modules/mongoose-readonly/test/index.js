// Load modules

var Lab = require('lab');
var Code = require('code');
var Plugin = require('../lib');
var Mongoose = require('mongoose');
var Async = require('async');


// Tests

var lab = exports.lab = Lab.script();

lab.before(function (done) {

    Mongoose.connect('mongodb://localhost/test-mongoose-readonly', function (err) {

        return done();
    });
});

lab.experiment('test-mongoose-readonly', function () {

    lab.test('register plugin with default options', function (done) {

        var schema = new Mongoose.Schema({
            username: String,
            password: String,
            jobs: {
                type: Number,
                default: 0,
                readonly: true
            }
        });

        schema.plugin(Plugin);

        Mongoose.model('User', schema);
        return done();
    });

    lab.test('register plugin with custom options', function (done) {

        var schema = new Mongoose.Schema({
            username: String,
            password: String,
            users: {
                type: Number,
                locked: true
            }
        });

        schema.plugin(Plugin, { key: '   locked   ' });

        Mongoose.model('Root', schema);
        return done();
    });

    lab.test('trying to set any value on readonly path, it returns a default value', function (done) {

        var User = Mongoose.model('User');
        var user = new User({ jobs: 30000 });

        Code.expect(user.jobs).to.be.equal(0);

        var Root = Mongoose.model('Root');
        var root = new Root();

        root.set('users', 6);
        Code.expect(root.users).to.not.exist();

        return done();
    });


    lab.test('execute findByIdAndUpdate query it returns new value', function (done) {

        var User = Mongoose.model('User');
        var user = new User({ username: 'bula', password: 'bula' });
        var Root = Mongoose.model('Root');
        var root = new Root({ username: 'root', password: 'root' });

        Async.parallel([
            function (cb) {
                user.save(cb);
            },
            function (cb) {
                root.save(cb);
            }
        ], function (err) {

            if (err) {
                return done(err);
            }

            User.findByIdAndUpdate(user.id, { $inc: {jobs: 4 } }, { new: true}, function (err, _user) {

                Code.expect(_user.jobs).to.be.equal(4);

                Root.findByIdAndUpdate(root.id, { $set: {users: 1000 } }, { new: true}, function (err, _root) {

                    Code.expect(_root.users).to.be.equal(1000);

                    _root.set('users', 5000);

                    Code.expect(_root.users).to.be.equal(1000);

                    return done();
                });
            });
        });
    });

    lab.after(function (done) {

        Mongoose.disconnect(function () {

            return done();
        });
    });

});

# mongoose-readonly

Allow readonly paths in mongoose Schemas

## Install

```bash
$ npm install mongoose-readonly
```

## Usage

```javascript
var Mongoose = require('mongoose');
var MongooseReadonly = require('./lib');

Mongoose.connect('mongodb://localhost/my-database', function (err) {

    if (err) {
        throw err;
    }

    var schema = new Mongoose.Schema({
        name: String,

        // This path only update when execute the method findByOneAndUpdate,
        // findByIdAndUpdate, or update
        counter: {
            type: Number,
            readonly: true,
            default: 0
        }
    });

    schema.plugin(MongooseReadonly);

    var Model = Mongoose.model('Person', schema);
    var model = new Model({
        name: 'My name',
        counter: 1000
    });

    console.log(model.counter);             // prints 0

    model.save(function (err, model) {

        Model.findByIdAndUpdate(model.id, { $inc: { counter: 1 } }, { new: true}, function (err, _model) {

            console.log(_model.counter);     // prints 1
            Mongoose.connection.db.dropDatabase();
            process.exit(0);
        });
    });
});
```

## Options

##### - key (default 'readonly')
####
## Tests
Run comand `make test` or `npm test`. Include 100% test coverage.

# License
MIT

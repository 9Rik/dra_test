// Load modules

var Joi = require('joi');
var Hoek = require('hoek');


// Declare internals

var internals = {
    schema: Joi.object({
        key: Joi.string().trim().default('readonly')
    })
};


exports = module.exports = internals.Plugin = function (schema, options) {

    var results = Joi.validate(options || {}, internals.schema);
    Hoek.assert(!results.error, results.error);
    var settings = results.value;

    schema.eachPath(function (path, schemaType) {

        if (schemaType.options[settings.key]) {
            schemaType.set(function () {

                return this[path] ? this[path] : schemaType.defaultValue;
            });
        }
    });
};

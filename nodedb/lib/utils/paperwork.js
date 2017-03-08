var _ = require('underscore');

function Visitor(path, errors) {
    this.path = path || 'body';
    this.errors = errors || [];
}

Visitor.prototype.enter = function(elem) {
    return new Visitor(this.path + '.' + elem, this.errors);
};

Visitor.prototype.enterArray = function(i) {
    return new Visitor(this.path + '[' + i + ']', this.errors);
};

Visitor.prototype.report = function (reason) {
    this.errors.push(this.path + ': ' + reason);

    return null;
};

Visitor.prototype.checkType = function (val, type) {
    if (typeof(val) === type)
        return val;

    this.report('should be a ' + type);

    return '';
};

Visitor.prototype.checkFun = function (val, fun, reason) {
    if (fun(val))
        return val;

   // this.report(reason || 'failed ' + getFunctionName(fun));

    return false;
};

Visitor.prototype.hasErrors = function () {
    return this.errors.length > 0;
};

function Optional(spec) {
    this.opt = spec;
}

function Multiple(specs) {
    this.mult = specs;
}

function paperwork(spec, val, visitor) {
    if (spec instanceof Optional)
        return val ? paperwork(spec.opt, val, visitor) : null;

    if (val === '')
        return spec;

    if (typeof spec === 'string')
        return visitor.checkType(val, 'string');

    if (typeof spec === 'boolean')
        return visitor.checkType(val, 'boolean');

    if (typeof spec === 'number')
        return visitor.checkType(val, 'number');

    /*if (spec === Array)
        return visitor.checkType(val, _.isArray);
    */

    if (_.isArray(spec)) {

        var itemSpec = spec[0];

        if (!visitor.checkFun(val, _.isArray))
            return itemSpec;

        return _(val).map(function (item, i) {
            return paperwork(itemSpec, item, visitor.enterArray(i));
        });
    }

    if (_.isObject(spec)) {
        if (!visitor.checkFun(val, _.isObject))
            return spec;

        var res = {};

        _(spec).each(function (subspec, field) {
            res[field] = paperwork(subspec, val[field], visitor.enter(field));
        });

        return res;
    }
}

function getFunctionName(fun) {
    var ret = fun.toString();

    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));

    return ret || 'custom validator';
}

module.exports = function (spec, blob) {
    var visitor = new Visitor();
    return paperwork(spec, blob, visitor);
};

module.exports.accepted = function (spec, blob) {
    var visitor = new Visitor(),
        validated = paperwork(spec, blob, visitor);

    if (visitor.hasErrors()) {
        return false;
    } else{
        return true;
    }
};

/*module.exports.accept = function (spec) {
 return function (req, res, next) {
 if (!req.body)
 throw new Error('express.bodyParser() not enabled');

 var visitor = new Visitor(),
 validated = paperwork(spec, req.body, visitor);

 if (!visitor.hasErrors()) {
 req.body = validated;

 return next();
 }

 //res.status(400).send({status: 'bad_request', reason: 'Body did not satisfy requirements', errors: visitor.errors});
 res.status(400).send({status: 400 ,message: 'Incorrect Request', nextStep: 'Login'});
 };
 };*/

module.exports.optional = function (spec) {
    return new Optional(spec);
};

module.exports.all = function () {
    return new Multiple(Array.prototype.slice.call(arguments));
};
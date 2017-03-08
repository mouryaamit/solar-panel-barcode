(function () {

    /*#####################################Event Module Require#######################################################*/
    var events = require('events').EventEmitter;
    var util = require('util');

    var utils = require('../utils/utils');

    var mongoModelObj = require('./mongoModelObj');

    var mongoDBFindQuery = module.exports.mongoDBFindQuery = function (collName, Routed, tnxID , fieldName) {

        events.call(this);
        var logger = utils.util();
        var log;
        var startedAt;
        var that = this;
        var txID = tnxID;
        /*############################################################################################################*/
        /*############################################################################################################*/

        var caller = function () {

            var Modeled = mongoModelObj.getModelByModelName(collName);
            startedAt = new Date();
            Modeled.modelObj.find(Routed, fieldName, function (err, testPart) {
                if (err) {
                    log = {id  : txID,msg : "MongoDB returned Error : Transaction ID : "+ txID + " Query :"+ JSON.stringify(Routed) + " Collection : "+ collName + " responseTime : "+JSON.stringify(new Date() - startedAt)};
                    logger.log(txID , log , 'mongoAfterFind');

                    that.emit('MongoQueryError', err);
                    return false;
                } else {
                    log = {id  : txID,msg : "Transaction ID : "+ txID +" Query :"+ JSON.stringify(Routed)+ " CollectionName : "+ collName + " responseTime : "+JSON.stringify(new Date() - startedAt)};
                    logger.log(txID , log , 'mongoAfterFind');

                    that.emit('MongoQuerySuccess', testPart);
                    return true;
                }
            });
        };

        this.execute = caller;
    };

    util.inherits(mongoDBFindQuery, events);
})();
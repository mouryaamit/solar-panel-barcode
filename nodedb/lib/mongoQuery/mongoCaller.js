(function () {

    /*#####################################Underscore Module Require##################################################*/
    var _ = require('underscore');

    /*#####################################SMR BizObj Module Require##################################################*/
    var mongoFindOneQuery = require('./mongoDbFindOneQuery').mongoDBFindOneQuery;
    var mongoDBFindQuery = require('./mongoDbFindQuery').mongoDBFindQuery;


    /*#####################################Routes Object##############################################################*/

    var mongoQueryObj = [
        {
            query: 'findOne',
            obj: mongoFindOneQuery
        },
        {
            query: 'find',
            obj: mongoDBFindQuery
        }
    ];

    var MongoQueryBinder = module.exports.MongoQueryBinder = function(){};

    MongoQueryBinder.prototype.signature = function (callback, bizObj) {

        //unbind event Listener for queryError
        bizObj.on('MongoQueryError', function (errObj) {

            callback(errObj , null);
        });

        //unbind event Listener for querySuccess
        bizObj.on('MongoQuerySuccess', function (resObj) {

            callback(null , resObj);
        });

        //event emitter method executed
        bizObj.execute();
    };

    MongoQueryBinder.prototype.getBizObj = function (method) {

        var bizObj = _.findWhere(mongoQueryObj, {query: method});
        if(bizObj.obj){
            return bizObj.obj;
        }else{
            return false;
        }
    };

})();
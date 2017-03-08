(function () {

    var mongoModelObj = require('./mongoModelObj');

    var logger = require('../utils/logger');

    var Methods = module.exports.Methods = function(modelName , Obj , tnxId){
        this.modeled = mongoModelObj.getModelByModelName(modelName);
        this.modelObj = Obj;
        this.tnxId = tnxId;
    };

    Methods.prototype.save = function (callback) {

        var modelObj = this.modeled.modelObj;

        var obj = new modelObj(this.modelObj);

        var that = this;

        obj.save(function (err, doc) {
            if(callback){
                callback(err , doc);
            }else{
                var log = 'TransactionId : '+ that.tnxId + ' Error : ' +  err;
                logger.consoleMessage(log , 'mongoAfterSave');
            }
        });
    };

    /*####################################################MONGO REMOVE METHOD#########################################*/
    /*################################################################################################################*/
    Methods.prototype.remove = function (callback) {

        var modelObj = this.modeled.modelObj;

        var that = this;

        modelObj.remove(this.modelObj , function (err) {
            if(callback){
                callback(true);
            }
        });
    };

    /*####################################################MONGO COUNT METHOD#########################################*/
    /*################################################################################################################*/
    Methods.prototype.count = function (callback) {

        var modelObj = this.modeled.modelObj;

        var that = this;

        modelObj.count(this.modelObj , function (err,count) {
            if(callback){
                callback(err,count);
            }
        });
    };

})();
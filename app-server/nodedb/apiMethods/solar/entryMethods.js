/**
 * Created by amitmourya on 08/04/17.
 */
(function(){

    var utils = require('../../lib/utils/utils');

    var errorResponse = require('../../gen/errorResponse');

    var successResponse = require('../../gen/successResponseMessage');

    var mongoModelName = require('../../lib/mongoQuery/mongoModelObj');

    function Entry(config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.barcode;
    }

    Entry.prototype = {
        addEntry: function(reqBody , callback){
            this.reqBody = reqBody;
            this.callback = callback;
            var routed = {
                barcode : this.reqBody.barcode
            }
            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.findEntryDone.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        findEntryDone:function(err , result){
            if(!result){
                var mongo = this.utils.initMongo(this.model ,this.reqBody , this.tnxId);
                var resHandle = this.addEntryDone.bind(this);
                mongo.Save(resHandle);
            } else {
                result.oldEntries.push({
                    updatedOn : result.updatedOn,
                    step: result.step
                });
                result.step = this.reqBody.step;
                var resHandle = this.addEntryDone.bind(this);
                result.save(resHandle);
            }
        },
        addEntryDone:function(err , result){
            if(!result){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.callback(null , {message: this.reqBody.module+" "+this.reqBody.step+"ed"});
            }
        },
        getStatus : function(reqBody , callback){
            this.reqBody = reqBody;
            this.callback = callback;
            var routed = {
                barcode : this.reqBody.barcode
            }
            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.getStatusDone.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        getStatusDone:function(err , result){
            if(!result){
                this.callback(null , {message: "No Record",status:"New"});
            }else{
                this.callback(null , {message: "Available", status:result.step});
            }
        }
    };

    module.exports = function(config , tnxId){
        return (new Entry(config , tnxId));
    };
})();
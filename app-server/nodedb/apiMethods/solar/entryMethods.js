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
            var mongo = this.utils.initMongo(this.model ,reqBody , this.tnxId);
            var resHandle = this.addEntryDone.bind(this);
            mongo.Save(resHandle);
        },
        addEntryDone:function(err , result){
            if(!result){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.callback(null , {message: this.reqBody.module+" "+this.reqBody.step+"ed"});
            }
        }
    };

    module.exports = function(config , tnxId){
        return (new Entry(config , tnxId));
    };
})();
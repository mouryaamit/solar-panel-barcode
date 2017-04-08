(function(){

    var _ = require('underscore');

    var utils = require('../lib/utils/utils');

    var schema = require('../gen/coreResponseSchema');

    var paperwork = require('../lib/utils/paperwork');

    var errorResponse = require('../gen/errorResponse');

    var successResponse = require('../gen/successResponseMessage');

    var batchMethods = require('./batchMethods');

    var recipientMethods = require('./recipientMethods');

    var fileBatchMethod = require('./fileBatchMethods');

    var alertMethod = require('../apiMethods/alertMethods');

    var Ach = function(config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
    };

    Ach.prototype = {
        processBatch: function(reqBody , callback){
            this.callback = callback;

            if(paperwork.accepted(schema.batchProcess, reqBody)) {
                this.bodyLen = reqBody.batchList.length;

                for (var i = 0; i < this.bodyLen; i++) {

                    var done = false;
                    if(this.bodyLen == i + 1) done = true;

                    var ach = new batchProcess(reqBody.batchList[i] ,this.callback , this.config , this.tnxId , done);//this.batchAuthorized.bind(this);
                    ach.batchAdd();
                }

                var alertObj = {
                    userId       : reqBody.userId,
                    emailId      : reqBody.userInform.emailId,
                    phoneNo      : reqBody.userInform.phoneNo,
                    alertMessage : 'When an ACH import file is processed',
                    emailMessage : 'ALERT:  ACH file '+ reqBody.fileName +' with effective date '+ reqBody.batchList[0].effectiveDate +' has been processed successfully.'
                 };

                 var alert = alertMethod(this.config , this.tnxId);
                 alert.sendAlerts(alertObj);
            }else{
                var error = this.errorResponse.BatchAuthorizeFailed;
                this.callback(error , null);
            }
        },
        deleteBatch: function(reqBody , callback){
            if(paperwork.accepted(schema.batchRemove, reqBody)) {
                this.bodyLen = reqBody.batchRemoveList.length;

                for (var i = 0; i < this.bodyLen; i++) {

                    var fileBatch = fileBatchMethod(this.config , this.tnxId);
                    fileBatch.removeFileBatch(reqBody.batchRemoveList[i].batchId);
                }
                callback(null , {message : this.successResponse.RemoveBatch})
            }else{
                var error = this.errorResponse.BatchRetrieveFailed;
                this.callback(error , null);
            }
        }
    };

    var batchProcess = function(batch , callback , config , tnxId , done){
        this.batch = batch;
        this.callback = callback;
        this.config = config;
        this.tnxId = tnxId;
        this.done = done;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
    };

    batchProcess.prototype = {
        batchAdd : function(){

            var resHandle = this.requestHandle.bind(this);
            var batch = batchMethods(this.config , this.tnxId);
            batch.directAddBatch(this.batch  , resHandle);
        },
        requestHandle: function(err , result){
            if(err){
                console.error('Batch Creation failed.');
            }else{

                var fileBatch = fileBatchMethod(this.config , this.tnxId);
                fileBatch.removeFileBatch(this.batch.batchId);

                var bodyLen = this.batch.recipients.length;

                for (var i = 0; i < bodyLen; i++) {
                    var ach = new recipientProcess(this.batch.recipients[i] ,this.config , this.tnxId);//this.batchAuthorized.bind(this);
                    ach.recipientAdd();
                }
            }

            if(this.done) this.callback(null , {message : this.successResponse.AddBatch});
        }
    };

    var recipientProcess = function(recipient , config , tnxId){
        this.recipient = recipient;
        this.config = config;
        this.tnxId = tnxId;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
    };

    recipientProcess.prototype = {
        recipientAdd : function(){
            var recipient = recipientMethods(this.config , this.tnxId);
            recipient.directAddRecipient(this.recipient);
        }
    };
    module.exports = function(config , tnxId){
        return (new Ach(config , tnxId));
    };
})();
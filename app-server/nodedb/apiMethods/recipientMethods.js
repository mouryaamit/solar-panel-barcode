(function(){

    var _ = require('underscore');

    var batchMethod = require('./batchMethods');

    var routingNumberMethod = require('./routingNumberMethods');

    var transactionLimitMethod = require('./transactionLimitsMethods');

    var utils = require('../lib/utils/utils');

    var schema = require('../gen/coreResponseSchema');

    var paperwork = require('../lib/utils/paperwork');

    var errorResponse = require('../gen/errorResponse');

    var successResponse = require('../gen/successResponseMessage');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    function Ach(config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.BatchRecipient;
    }

    Ach.prototype = {
        getAllRecipientForBatch:function(reqBody , callback){
            var mongo = this.utils.initMongo(this.model ,reqBody , this.tnxId);
            mongo.FindMethod(callback);
        },
        addRecipient       : function(reqBody , callback){
            this.callback = callback;

            var routed = {
                institutionId           : this.config.instId,
                userId                  : reqBody.userId,
                transactionType         : 'ACHDebit',
                transactionAmount       : reqBody.amount
            };

            var ACHCredit = ['22' , '23' , '32' , '33' , '52' , '53'];
            if(_.contains(ACHCredit , reqBody.transactionCode)) routed.transactionType = 'ACHCredit';

            var recipientId = this.utils.getToken();
            this.batchId = reqBody.batchId;

            this.routed = {
                institutionId                           : this.config.instId,
                batchId                                 : reqBody.batchId,
                recipientName                           : reqBody.recipientName,
                recipientId                             : recipientId,
                identity                                : reqBody.identity,
                accountNo                               : reqBody.accountNo,
                routingNumber                           : reqBody.routingNumber,
                amount                                  : reqBody.amount,
                transactionCode                         : reqBody.transactionCode,
                expirationDate                          : reqBody.expirationDate,
                addenda                                 : reqBody.addenda
            };

            var transaction = transactionLimitMethod(this.config , this.tnxId);
            var resHandle = this.transactionCheck.bind(this);
            transaction.transactionPerDay(routed , resHandle);
        },
        transactionCheck: function(err , success){
            if(err){
                this.callback(err , null);
            }else {
                var routingNumber = routingNumberMethod(this.config , this.tnxId);
                var resHandle = this.validOrInvalidRoutingNo.bind(this);
                routingNumber.checkRoutingNo(this.routed.routingNumber , resHandle, "ach");
            }
        },
        validOrInvalidRoutingNo: function(err , result){
            if(!result){
                var error = this.errorResponse.RoutingNumberFailed;
                this.callback(error , null);
            }else{
                var mongo = this.utils.initMongo(this.model, this.routed, this.tnxId);
                var resHandle = this.recipientAdded.bind(this);
                mongo.Save(resHandle);
            }
        },
        directAddRecipient : function(reqBody){
            var routed = {
                institutionId                           : this.config.instId,
                batchId                                 : reqBody.batchId,
                recipientName                           : reqBody.recipientName,
                recipientId                             : reqBody.recipientId,
                identity                                : reqBody.identity,
                accountNo                               : reqBody.accountNo,
                routingNumber                           : reqBody.routingNumber,
                amount                                  : reqBody.amount,
                transactionCode                         : reqBody.transactionCode,
                expirationDate                          : reqBody.expirationDate,
                addenda                                 : reqBody.addenda
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            mongo.Save();
        },
        recipientAdded: function(err , result){
            if(err){
                var error = this.errorResponse.RecipientCreationFailed;
                this.callback(error , null);
            }else{
                this.updateRecipientBatch(this.batchId);
                var success = {
                    message : this.successResponse.AddRecipient
                };

                this.callback(null , success);
            }
        },
        updateBatchStatus: function(err , result){
            if(!result){
                console.error('Batch was not update to pending status');
            }else{
                result.status = this.config.status.Pending;
                result.save();
            }
        },
        includeRecipient: function(reqBody , callback){
            this.callback = callback;

            this.ExIn = 0;
            if(paperwork.accepted(schema.recipientInclude, reqBody)) {

                this.bodyLen = reqBody.recipientIncludeList.length;

                this.status = this.config.status.Included;
                this.rList = '';
                this.message = this.successResponse.IncludeRecipient;
                for (var i = 0; i < this.bodyLen; i++) {
                    var routed = {
                        institutionId       : this.config.instId,
                        recipientId         : reqBody.recipientIncludeList[i].recipientId
                    };

                    var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                    var resHandle = this.recipientInEx.bind(this);
                    mongo.FindOneMethod(resHandle);
                }
            }else{
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }
        },
        excludeRecipient: function(reqBody , callback){
            this.callback = callback;

            this.ExIn = 0;
            if(paperwork.accepted(schema.recipientExclude, reqBody)) {

                this.bodyLen = reqBody.recipientExcludeList.length;

                this.status = this.config.status.Excluded;
                this.rList = '';
                this.message = this.successResponse.ExcludeRecipient;
                for (var i = 0; i < this.bodyLen; i++) {
                    var routed = {
                        institutionId       : this.config.instId,
                        recipientId         : reqBody.recipientExcludeList[i].recipientId
                    };

                    var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                    var resHandle = this.recipientInEx.bind(this);
                    mongo.FindOneMethod(resHandle);
                }
            }else{
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }
        },
        recipientInEx: function(err , result){
            this.ExIn = this.ExIn + 1;

            var repName = '';
            var batchId = '';
            if(!result){
                var error = this.errorResponse.OperationFailed;
                //this.callback(error , null);
                this.someFailed = true;
                console.error(error);
            }else{
                batchId = result.batchId;
                repName = result.recipientName;
                result.status = this.status;
                result.save();
            }

            if(this.ExIn == this.bodyLen){
                this.updateRecipientBatch(batchId);
                this.message = this.rList + repName + this.message;
                this.callback(null , {message : this.message});
            }else{
                this.rList = this.rList + repName +',';
            }
        },
        removeRecipient: function(reqBody , callback){
            this.callback = callback;

            if(paperwork.accepted(schema.recipientRemove, reqBody)) {

                this.removedRecp = 0;
                this.bodyLen = reqBody.recipientRemoveList.length;

                for (var i = 0; i < this.bodyLen; i++) {
                    var routed = {
                        institutionId       : this.config.instId,
                        recipientId         : reqBody.recipientRemoveList[i].recipientId
                    };

                    var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                    var resHandle = this.recipientRemoveStatus.bind(this);
                    mongo.FindOneMethod(resHandle);
                }

                this.callback(null, {message: this.successResponse.RemoveRecipient});
            }else{
                var error = this.errorResponse.RecipientRetrieveFailed;
                this.callback(error , null);
            }
        },
        recipientRemoveStatus: function(err , result){
            this.removedRecp = this.removedRecp + 1;
            var batchId = '';
            if(result){
                var status = this.config.status.Rejected;
                if(result.instructionId == '') status = this.config.status.Deleted;

                batchId = result.batchId;
                result.status = status;
                result.save();
            }

            if(this.removedRecp == this.bodyLen){
                this.updateRecipientBatch(batchId);
            }
        },
        updateRecipient: function(reqBody , callback){
            this.callback = callback;
            this.reqBody = reqBody;

            var routed = {
                institutionId           : this.config.instId,
                userId                  : reqBody.userId,
                transactionType         : 'ACHDebit',
                transactionAmount       : reqBody.amount
            };

            var ACHCredit = ['22' , '23' , '32' , '33' , '52' , '53'];
            if(_.contains(ACHCredit , reqBody.transactionCode)) routed.transactionType = 'ACHCredit';


            var transaction = transactionLimitMethod(this.config , this.tnxId);
            var resHandle = this.updateTransactionCheck.bind(this);
            transaction.transactionPerDay(routed , resHandle);
        },
        updateTransactionCheck: function(err , success){
            if(err){
                this.callback(err , null);
            }else{

                var routingNumber = routingNumberMethod(this.config , this.tnxId);
                var resHandle = this.updateRoutingNoCheck.bind(this);
                routingNumber.checkRoutingNo(this.reqBody.routingNumber , resHandle, "ach");
            }
        },
        updateRoutingNoCheck: function(err , result){
            if(!result){
                var error = this.errorResponse.RoutingNumberFailed;
                this.callback(error , null);
            }else{
                var routed = {
                    institutionId           : this.config.instId,
                    recipientId             : this.reqBody.recipientId
                };

                var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
                var resHandle = this.recipientUpdated.bind(this);
                mongo.FindOneMethod(resHandle);
            }
        },
        recipientUpdated : function(err , result){
            if(!result){
                var error = this.errorResponse.RecipientRetrieveFailed;
                this.callback(error , null);
            }else{
                result.recipientName = this.reqBody.recipientName;
                result.identity = this.reqBody.identity;
                result.accountNo = this.reqBody.accountNo;
                result.routingNumber = this.reqBody.routingNumber;
                result.amount = this.reqBody.amount;
                result.transactionCode = this.reqBody.transactionCode;
                result.expirationDate = this.reqBody.expirationDate;
                result.addenda = this.reqBody.addenda;
                this.updateRecipientBatch(result.batchId);

                result.save();

                this.callback(null , {message : this.successResponse.UpdateRecipient});
            }
        },
        retrieveRecipient  : function(reqBody , callback){
            this.callback = callback;

            var routed = {
                institutionId                           : this.config.instId,
                batchId                                 : reqBody.batchId,
                status                                  : { $in: [this.config.status.Included , this.config.status.Excluded]}
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.recipientRetrieval.bind(this);
            mongo.FindMethod(resHandle);
        },
        recipientRetrieval: function(err , result){
            if(err){
                var error = this.errorResponse.RecipientRetrieveFailed;
                this.callback(error , null);
            }else{
                this.callback(null , result);
            }
        },
        updateRecipientBatch: function(batchId){
            var batch = batchMethod(this.config , this.tnxId);
            var resHandle = this.updateBatchStatus.bind(this);
            batch.defaultMethod({institutionId : this.config.instId, batchId : batchId} , resHandle);
        }
    };

    module.exports = function(config , tnxId){
        return (new Ach(config , tnxId));
    };
})();
(function(){

    var _ = require('underscore');

    var moment = require('moment');

    var utils = require('../lib/utils/utils');

    var schema = require('../gen/coreResponseSchema');

    var paperwork = require('../lib/utils/paperwork');

    var errorResponse = require('../gen/errorResponse');

    var successResponse = require('../gen/successResponseMessage');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var alertMethod = require('../apiMethods/alertMethods');

    var addAchInstruction = require('../server/coreMethods/addAchInstructionCore');

    var achMaintenanceCore = require('../server/coreMethods/achMaintenanceCore');

    function Ach(config , tnxId){
        var dated = new Date();
        this.dated = moment(dated).format('MM/DD/YYYY');
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
        this.batchAuth = 0;
        this.model = mongoModelName.modelName.Batch;
        this.BatchRecipientModel = mongoModelName.modelName.BatchRecipient;
    }

    Ach.prototype = {

        reinitiateACHBatch: function (reqBody, callback) {
            reqBody.batchId = this.utils.getToken();
            this.req = reqBody;
            this.callback = callback;

            var resHandle = this.reinitiateACHBatchNext.bind(this);
            this.directAddBatch(reqBody,resHandle);
        },
        reinitiateACHBatchNext: function (err, result) {
            if (err) {
                var error = this.errorResponse.BatchCreationFailed;
                this.callback(error, null);
            } else {
                this.newBatch = result;
                var routed = {
                    institutionId: this.config.instId,
                    batchId : this.req.oldBatchId
                };
                var resHandle = this.getAllRecipientForOldBatch.bind(this);
                this.getAllRecipientForBatch(routed,resHandle)
            }
        },
        getAllRecipientForBatch:function(reqBody , callback){
            var mongo = this.utils.initMongo(this.BatchRecipientModel ,reqBody , this.tnxId);
            mongo.FindMethod(callback);
        },
        getAllRecipientForOldBatch: function (err, result) {
            if(err){
                this.newBatch.remove()
                var error = this.errorResponse.BatchCreationFailed;
                this.callback(error, null);
            } else {
                this.processedRecipients = 0;
                this.oldBatchRecipients = result.length;

                var resHandle = this.addAllRecipientForNewBatchDone.bind(this);
                for(var i = 0 ; i < result.length ; i ++){
                    var recipientId = this.utils.getToken();
                    this.directAddRecipient({
                        institutionId                           : this.config.instId,
                        batchId                                 : this.newBatch.batchId,
                        recipientName                           : result[i].recipientName,
                        recipientId                             : recipientId,
                        identity                                : result[i].identity,
                        accountNo                               : result[i].accountNo,
                        routingNumber                           : result[i].routingNumber,
                        amount                                  : result[i].amount,
                        transactionCode                         : result[i].transactionCode,
                        expirationDate                          : result[i].expirationDate,
                        addenda                                 : result[i].addenda
                    },resHandle)
                }
            }
        },
        directAddRecipient : function(reqBody,callback){
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

            var mongo = this.utils.initMongo(this.BatchRecipientModel ,routed , this.tnxId);
            mongo.Save(callback);
        },
        addAllRecipientForNewBatchDone: function (err, result) {
            this.processedRecipients++;
            if(this.processedRecipients == this.oldBatchRecipients){
                var success = {
                    message: this.successResponse.AddBatch
                };

                this.callback(null, success);
            }
        },
        processACHBatch: function (reqBody, callback) {
            this.callback = callback;

            var routed = {
                institutionId: this.config.instId,
                batchId: reqBody.batchId
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.processACHBatchNext.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        processACHBatchNext: function (err, result) {
            if (err) {
                var error = this.errorResponse.BatchRetrieveFailed;
                this.callback(error, null);
            } else {
                result.status = this.config.status.Submitted;
                var resHandle = this.processACHBatchDone.bind(this);
                result.save(resHandle)
            }
        },
        processACHBatchDone: function (err, result) {
            if (err) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                var success = {
                    message: this.successResponse.UpdateBatch
                };

                this.callback(null, success);
            }
        },
        addBatch : function(reqBody , callback){
            this.callback = callback;

            var batchId = this.utils.getToken();

            this.reqBody = reqBody;
            this.routed = {
                institutionId                           : this.config.instId,
                userId                                  : reqBody.userId,
                batchId                                 : batchId,
                batchCoreId                             : '',
                batchName                               : reqBody.batchName,
                secCode                                 : reqBody.secCode,
                accountNo                               : reqBody.accountNo,
                companyName                             : reqBody.companyName,
                companyDiscretionaryData                : reqBody.companyDiscretionaryData,
                companyId                               : reqBody.companyId,
                companyDescription                      : reqBody.companyDescription,
                batchDescription                        : reqBody.batchDescription,
                scheduleType                            : reqBody.scheduleType,
                dateScheduled                           : reqBody.dateScheduled,
                dateNextScheduled                       : reqBody.dateScheduled,
                frequency                               : reqBody.frequency,
                dateScheduledProcess                    : reqBody.dateScheduledProcess,
                expirationDate                          : reqBody.expirationDate,
                status                                  : this.config.status.Pending
            };

            var mongo = this.utils.initMongo(this.model, this.routed, this.tnxId);
            var resHandle = this.batchAdded.bind(this);
            mongo.Save(resHandle);


            /*
            var routed = {
                institutionId                           : this.config.instId,
                userId                                  : reqBody.userId,
                batchName                               : reqBody.batchName
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.batchExists.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        batchExists: function(err , result){
            if(!result){
                var mongo = this.utils.initMongo(this.model ,this.routed , this.tnxId);
                var resHandle = this.batchAdded.bind(this);
                mongo.Save(resHandle);
            }else{
                var error = this.errorResponse.BatchExistsFailed;
                this.callback(error , null);
            }*/
        },
        directAddBatch : function(reqBody , callback){
            var routed = {
                institutionId                           : this.config.instId,
                userId                                  : reqBody.userId,
                batchId                                 : reqBody.batchId,
                batchCoreId                             : '',
                batchName                               : reqBody.batchName,
                secCode                                 : reqBody.secCode,
                accountNo                               : reqBody.accountNo,
                companyName                             : reqBody.companyName,
                companyDiscretionaryData                : reqBody.companyDiscretionaryData,
                companyId                               : reqBody.companyId,
                companyDescription                      : reqBody.companyDescription,
                batchDescription                        : reqBody.batchDescription,
                dateScheduled                           : reqBody.dateScheduled,
                dateNextScheduled                       : reqBody.dateScheduled,
                frequency                               : reqBody.frequency,
                dateScheduledProcess                    : reqBody.dateScheduledProcess,
                expirationDate                          : reqBody.expirationDate,
                effectiveDate                           : reqBody.effectiveDate,
                status                                  : this.config.status.Pending
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            mongo.Save(callback);
        },
        batchAdded : function(err , result){
            if(err){
                var error = this.errorResponse.BatchCreationFailed;
                this.callback(error , null);
            }else{

                /*var alertObj = {
                    userId       : this.reqBody.userId,
                    emailId      : this.reqBody.userInform.emailId,
                    phoneNo      : this.reqBody.userInform.phoneNo,
                    alertMessage : 'When an ACH batch is submitted for processing'
                 };

                 var alert = alertMethod(this.config , this.tnxId);
                 alert.sendAlerts(alertObj);*/

                var success = {
                    message         : this.successResponse.AddBatch,
                    otpForService   : 'achNewBatch',
                    nextStep        : this.config.nextStepTo.goToAchBatchSummary
                };

                this.callback(null , success);

            }
        },
        removeBatch : function(reqBody , callback){
            this.callback = callback;
            this.processedBatch = 0;
            if(paperwork.accepted(schema.batchRemove, reqBody)) {

                this.bodyLen = reqBody.batchRemoveList.length;
                for (var i = 0; i < this.bodyLen; i++) {

                    var routed = {
                        institutionId                           : this.config.instId,
                        batchId                                 : reqBody.batchRemoveList[i].batchId
                    };

                    var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
                    var resHandle = this.batchRemoved.bind(this);
                    mongo.FindOneMethod(resHandle);
                }

            }else{
                var error = this.errorResponse.BatchRetrieveFailed;
                this.callback(error , null);
            }
        },
        batchRemoved: function (err, result) {
            this.processedBatch++;
            result.status = this.config.status.Deleted;
            result.save();
            if (this.processedBatch == this.bodyLen) {
                this.callback(null, {message: this.successResponse.RemoveBatch});
            }
        },
        updateBatch : function(reqBody , callback){
            this.callback = callback;
            this.reqBody = reqBody;

            var routed = {
                institutionId                           : this.config.instId,
                batchId                                 : reqBody.batchId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.batchUpdated.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        batchUpdated : function(err , result){
            if(!result){
                var error = this.errorResponse.BatchRetrieveFailed;
                this.callback(error , null);
            }else{
                result.batchName = this.reqBody.batchName;
                result.secCode = this.reqBody.secCode;
                result.accountNo = this.reqBody.accountNo;
                result.companyName = this.reqBody.companyName;
                result.companyDiscretionaryData = this.reqBody.companyDiscretionaryData;
                result.companyId = this.reqBody.companyId;
                result.companyDescription = this.reqBody.companyDescription;
                result.batchDescription = this.reqBody.batchDescription;
                result.dateScheduled = this.reqBody.dateScheduled;
                result.dateNextScheduled = this.reqBody.dateScheduled;
                result.scheduleType = this.reqBody.scheduleType;
                result.frequency = this.reqBody.frequency;
                result.dateScheduledProcess = this.reqBody.dateScheduledProcess;
                result.expirationDate = this.reqBody.expirationDate;
                result.status = this.config.status.Pending;
                result.save();

                this.callback(null , {message : this.successResponse.UpdateBatch , nextStep : this.config.nextStepTo.goToAchBatchSummary });
            }
        },
        authorizeBatch : function(reqBody , callback){
            this.callback = callback;

            this.customerId = reqBody.customersId;
            this.instructionData = [];
            this.deleteInstruction = [];
            this.modifyInstruction = [];
            this.authorisedCount = 0;
            if(paperwork.accepted(schema.batchAuthorize, reqBody)) {
                this.bodyLen = reqBody.authorizeList.length;

                for (var i = 0; i < this.bodyLen; i++) {

                    var routed = {
                        institutionId                           : this.config.instId,
                        batchId                                 : reqBody.authorizeList[i].batchId
                    };

                    var done = this.authorizeBatchToCore.bind(this);
                    var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                    var updateData = this.addToInstruction.bind(this);
                    var ach = new batchAuthorized(reqBody.authorizeList[i] , updateData , this.config , this.tnxId , done , reqBody);
                    var resHandle = ach.authorized.bind(ach);
                    mongo.FindOneMethod(resHandle);
                }
            }else{
                var error = this.errorResponse.BatchAuthorizeFailed;
                this.callback(error , null);
            }
        },
        addToInstruction: function(instructionObj){
            if(instructionObj.instructionType == "Add"){
                this.instructionData.push(instructionObj.instructionDataObj);
            }else if(instructionObj.instructionType == "Delete"){
                var deleteObj = {
                    instructionId : instructionObj.instructionId
                };
                this.deleteInstruction.push(deleteObj);
            }else if(instructionObj.instructionType == "Modify"){
                instructionObj.instructionDataObj.instructionId = instructionObj.instructionId;
                this.modifyInstruction.push(instructionObj.instructionDataObj);
            }
            return true;
        },
        authorizeBatchToCore: function(){
            this.authorisedCount = this.authorisedCount + 1;
            if(this.bodyLen == this.authorisedCount) {
                if ((this.instructionData).length > 0) {
                    var ach = addAchInstruction.AddAchInstruction(this.instructionData, this.customerId, this.config, this.tnxId);
                    var resHandle = this.updateRecipientAfterCore.bind(this);
                    ach.coreCaller(resHandle);
                }

                var instructionInfo = {
                    customerId: this.customerId,
                    isSearch: false,
                    requestType: "Delete"
                };
                if ((this.deleteInstruction).length > 0) {
                    var achDelete = achMaintenanceCore.AchMaintenanceInst(this.deleteInstruction, instructionInfo, this.config, this.tnxId);
                    var deleteHandler = this.modifyDeleteCoreHandle.bind(this);
                    achDelete.coreCaller(deleteHandler);
                }

                if ((this.modifyInstruction).length > 0) {
                    instructionInfo.requestType = "Edit";
                    var achEdit = achMaintenanceCore.AchMaintenanceInst(this.modifyInstruction, instructionInfo, this.config, this.tnxId);
                    var editHandler = this.modifyDeleteCoreHandle.bind(this);
                    achEdit.coreCaller(editHandler);
                }

                this.callback(null , {message : this.successResponse.AuthoriseBatch , otpForService: 'achBatchAuthorization', nextStep : this.config.nextStepTo.goToAchBatchAuthorization });
            }
        },
        updateRecipientAfterCore: function(err , result){
            if(err){
                this.utils.log(this.tnxId , err , 'console.log');
                //console.log(err);
            }else{
                var response = result.inbResponse;
                var rLength = response.length;
                for(var i = 0; i < rLength; i++){
                    var batchRecipient = new batchAuthorized({} , null , this.config , this.tnxId , null);
                    batchRecipient.updateRecipientID(response[i].channelInstructionId , response[i].coreInstructionId);
                }
            }
        },
        modifyDeleteCoreHandle: function(err , result){
            var msg = result;
            if(err) msg = err;

            this.utils.log(this.tnxId , err , 'console.log');
            //console.log(msg);
        },
        declineBatch : function(reqBody , callback){
            this.callback = callback;

            this.reqBody = reqBody;
            if(paperwork.accepted(schema.batchDeAuthorize, reqBody)) {
                this.bodyLen = reqBody.declineList.length;

                for (var i = 0; i < this.bodyLen; i++) {

                    var routed = {
                        institutionId                           : this.config.instId,
                        batchId                                 : reqBody.declineList[i].batchId
                    };

                    var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                    var resHandle = this.batchDeAuthorized.bind(this);
                    mongo.FindOneMethod(resHandle);
                }
            }else{
                var error = this.errorResponse.BatchDeAuthorizeFailed;
                this.callback(error , null);
            }
        },
        batchDeAuthorized: function(err , result){
            this.batchAuth = this.batchAuth + 1;

            if(!result){
                var error = this.errorResponse.BatchDeAuthorizeFailed;
                //this.callback(error , null);
                this.someFailed = true;
                this.utils.log(this.tnxId , error , 'console.log');
                //console.log(error , null);
            }else{
                result.status = this.config.status.Rejected;
                result.save();
                var alertObj = {
                    userId       : this.reqBody.userId,
                    emailId      : this.reqBody.userInform.emailId,
                    phoneNo      : this.reqBody.userInform.phoneNo,
                    alertMessage : 'When an ACH batch was not processed',
                    emailMessage : 'ALERT:  ACH batch ' + result.batchName + ' with effective date '+ result.effectiveDate +' has been declined.'
                };

                var alert = alertMethod(this.config , this.tnxId);
                alert.sendAlerts(alertObj);
            }

            if(this.batchAuth == this.bodyLen && !this.someFailed){
                this.callback(null , {message : this.successResponse.DeAuthoriseBatch});
            }else{
                console.error('Batch DeAuthorization has been Successful. Some Batches Failed to DeAuthorize');
                this.callback(null , {message : this.successResponse.DeAuthoriseBatch});
            }
        },
        retrieveBatch: function(reqBody , callback){
            this.callback = callback;

            var routed = {
                institutionId                           : this.config.instId,
                batchId                                 : reqBody.batchId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.batchRetrieval.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        retrieveAllBatch: function(reqBody , callback){
            this.callback = callback;

            var routed = {
                institutionId                           : this.config.instId,
                userId                                  : reqBody.userId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.batchRetrieval.bind(this);
            mongo.FindMethod(resHandle);
        },
        retrievePendingBatch: function(reqBody , callback){
            this.callback = callback;

            var routed = {
                institutionId                   : this.config.instId,
                userId                          : reqBody.userId,
                status: this.config.status.Submitted
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.batchRetrieval.bind(this);
            mongo.FindMethod(resHandle);
        },
        retrieveEditableBatch: function(reqBody , callback){
            this.callback = callback;

            var routed = {
                institutionId           : this.config.instId,
                userId                  : reqBody.userId,
                $or                     : [{ status : this.config.status.Pending },{ scheduleType : this.config.status.Recurring }]
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.returnEditableBatch.bind(this);
            mongo.FindMethod(resHandle);
        },
        returnEditableBatch: function(err , result){
            if(err){
                var error = this.errorResponse.BatchRetrieveFailed;
                this.callback(error , null);
            }else{
                this.callback(null , result);
            }
        },
        batchRetrieval: function(err , result){
            if(err){
                var error = this.errorResponse.BatchRetrieveFailed;
                this.callback(error , null);
            }else{
                this.bodyLen = result.length;
                this.retrievalRec = 0;
                this.batchArray = [];
                if(this.bodyLen == 0){
                    this.callback(null , result);
                    return true;
                }

                for (var i = 0 ; i < this.bodyLen; i++){

                    var currentBatch = {
                        updatedOn: result[i].updatedOn,
                        createdOn: result[i].createdOn,
                        userId: result[i].userId,
                        batchId: result[i].batchId,
                        batchName: result[i].batchName,
                        secCode: result[i].secCode,
                        accountNo: result[i].accountNo,
                        companyName: result[i].companyName,
                        companyDiscretionaryData: result[i].companyDiscretionaryData,
                        companyId: result[i].companyId,
                        companyDescription: result[i].companyDescription,
                        batchDescription: result[i].batchDescription,
                        dateScheduled: result[i].dateScheduled,
                        dateNextScheduled: result[i].dateNextScheduled || '',
                        dateLastProcessed: result[i].dateLastProcessed || '',
                        scheduleType: result[i].scheduleType,
                        frequency: result[i].frequency,
                        dateScheduledProcess: result[i].dateScheduledProcess,
                        expirationDate: result[i].expirationDate,
                        status: result[i].status,
                        items : 0,
                        credit : 0.00,
                        debit : 0.00
                    };

                    var routed = {
                        institutionId           : this.config.instId,
                        batchId                 : result[i].batchId,
                        status                  : this.config.status.Included
                    };

                    var model = mongoModelName.modelName.BatchRecipient;
                    var mongo = this.utils.initMongo(model, routed, this.tnxId);
                    var batchArray = this.updateBatchArray.bind(this);
                    var batch = new batchRecipientRetrieve(currentBatch , this.config , this.tnxId ,batchArray);
                    var resHandle = batch.getRecipientInfo.bind(batch);
                    mongo.FindMethod(resHandle);
                }
            }
        },
        updateBatchArray: function(batch){
            this.batchArray.push(batch);
            this.retrievalRec = this.retrievalRec + 1;
            if(this.bodyLen == this.retrievalRec){
                this.callback(null , this.batchArray);
            }
        },
        recurringBatchSchedule: function(){

            var routed = {
                institutionId           : this.config.instId,
                status                  : this.config.status.Scheduled,
                scheduleType            : 'Recurring',
                dateNextScheduled       : this.dated
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.forAllRecurringBatch.bind(this);
            mongo.FindMethod(resHandle);
        },
        forAllRecurringBatch: function(err , result){
            if(err) result = [];
            for(var i= 0; i < result.length; i++){
                var batchObj = {
                    institutionId       : this.config.instId,
                    batchId             : result[i].batchId
                };
                var instructionInfo = {
                    customerId      : this.customerId,
                    isSearch        : true,
                    requestType     : "Search"
                };
                var achSearch = achMaintenanceCore.AchMaintenanceInst(batchObj ,instructionInfo , this.config , this.tnxId);
                var searchHandler = this.updateBatchProcessed.bind(this);
                achSearch.coreCaller(searchHandler);
            }
        },
        updateBatchProcessed: function(err , result){
            if(err){
                this.utils.log(this.tnxId , err , 'console.log');
                //console.log(err);
            }else{
                var batchArray = result.maintenanceInstructions;
                if(batchArray.length > 0){
                    var batchNextInstructionDate = batchArray[0].recurringInstructionData.nextInstructionDate.date;
                    var batchLastInstructionDate = batchArray[0].recurringInstructionData.lastProcessedDate.date;
                    var batchId = batchArray[0].batchId.batchId;
                    var batchModel = mongoModelName.getModelByModelName(mongoModelName.modelName.Batch);
                    batchModel.modelObj.findOne({institutionId : this.config.instId, batchId : batchId },function(err , batch){
                        batch.dateNextScheduled = batchNextInstructionDate;
                        batch.dateLastProcessed = batchLastInstructionDate;
                        batch.save();
                    });
                }
            }
        },
        defaultMethod: function(routed , callback){
            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            mongo.FindOneMethod(callback);
        },
        defaultAllMethod: function(routed , callback){
            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            mongo.FindMethod(callback);
        }
    };

    var batchRecipientRetrieve = function(batchObj, config , tnxId ,updateArray){
        this.tnxId = tnxId;
        this.config = config;
        this.batchInfo = batchObj;
        this.updatedBatch = updateArray;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.utils = utils.util();
    };

    batchRecipientRetrieve.prototype = {
        getRecipientInfo: function(err , result){
            if(err){
                this.batchInfo.items = 0;
                this.batchInfo.credit = 0.00;
                this.batchInfo.debit = 0.00;

                this.updatedBatch(this.batchInfo);
            }else{
                var creditArray = ['22','23','32','33','52' ,'53'];
                var debitArray = ['27','28','37','38','55'];

                var itemLength = result.length;
                var credit = 0.00;
                var debit = 0.00;

                for(var i = 0; i < itemLength; i++) {
                    if (_.contains(creditArray, result[i].transactionCode)) {
                        credit = credit + parseFloat(result[i].amount);
                    } else {
                        debit = debit + parseFloat(result[i].amount);
                    }
                }

                this.batchInfo.items = itemLength;
                this.batchInfo.credit = credit;
                this.batchInfo.debit = debit;

                this.updatedBatch(this.batchInfo);
            }
        }
    };

    var batchAuthorized = function(eDate , callback , config , tnxId , done , userData){
        this.callback = callback;
        this.tnxId = tnxId;
        this.config = config;
        this.effectiveDate = eDate.effectiveDate;
        this.userData = userData;
        this.done = done;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.utils = utils.util();
    };

    batchAuthorized.prototype = {
        authorized: function(err , result){
            if(!result){
                var error = this.errorResponse.BatchAuthorizeFailed;
                this.utils.log(this.tnxId , error , 'console.log');
                //console.log(error , null);
            }else{
                this.result = result;
                this.result.status = this.config.status.Scheduled;
                this.result.effectiveDate = this.effectiveDate;

                var alertObj = {
                    userId       : this.userData.userId,
                    emailId      : this.userData.userInform.emailId,
                    phoneNo      : this.userData.userInform.phoneNo,
                    alertMessage : 'When an ACH batch is processed',
                    emailMessage : 'ALERT:  ACH batch ' + this.result.batchName + ' has been processed successfully for effective date '+ this.result.effectiveDate +'.'
                };

                var alert = alertMethod(this.config , this.tnxId);
                alert.sendAlerts(alertObj);

                var recipientModel = mongoModelName.getModelByModelName(mongoModelName.modelName.BatchRecipient);
                var resHandle = this.insertRecipient.bind(this);
                recipientModel.modelObj.find({institutionId : this.config.instId, batchId: result.batchId ,status: { $in: [this.config.status.Included , this.config.status.Rejected]}}, resHandle);
            }
        },
        insertRecipient: function(err , recipients){
            var rLength = recipients.length || 0;
            var that = this;

            var paymentType = {
                OneTime : "ONETIME",
                Recurring: "RECURRENCE"
            };
            var frequencyObj = {
                "Daily"             : "DAILY",
                "Weekly"            : "WEEKLY",
                "Monthly"           : "MONTHLY",
                "Quarterly"         : "QUARTERLY",
                "Semi Annually"     : "SEMI_ANNUAL",
                "Anually"           : "ANNUALY"
            };

            for(var i= 0; i< rLength; i++){
                var instructionObj = {
                    instructionDataObj : {
                        "batchId": {
                            "batchId": this.result.batchId,
                            "inbInstructionId": recipients[i].recipientId
                        },
                        "fundingAccNumber": this.result.accountNo,
                        "individualName": recipients[i].recipientName,
                        "individualIdNo": recipients[i].identity,
                        "receivingRoutingNo": recipients[i].routingNumber,
                        "receivingAccountNo": recipients[i].accountNo,
                        "transactionCode": recipients[i].transactionCode,
                        "amount": {
                            "currency": "USD",
                            "amount": recipients[i].amount
                        },
                        "discretionayData": this.result.companyDiscretionaryData,
                        "addenda": recipients[i].addenda,
                        "prenote": false,
                        "secCode": this.result.secCode,
                        "paymentType": paymentType[this.result.scheduleType],
                        "effectiveEntryDate": {
                            "date": this.result.effectiveDate
                        },
                        "instructionDescription": "",
                        "instructionDescretionaryData": "",
                        "recurringInstructionData": {
                            "frequencyType": null,
                            "endAfterPayments": null,
                            //"endDate": null,
                            "endDays": null,
                            "startDate": null,
                            //"nextInstructionDate": null
                        }
                    },
                    instructionType : 'Add'
                };

                if(this.result.scheduleType == "Recurring"){
                    instructionObj.instructionDataObj.recurringInstructionData.frequencyType = (typeof frequencyObj[this.result.frequency] == "undefined")?"":frequencyObj[this.result.frequency];
                    if(recipients[i].expirationDate) {
                        instructionObj.instructionDataObj.recurringInstructionData.endDate = {
                            "date": recipients[i].expirationDate
                        };
                    }
                    instructionObj.instructionDataObj.recurringInstructionData.startDate = {
                        "date":this.result.dateScheduled
                    };
                    // moment(this.result.dateScheduled,'MM/DD/YYYY').toDate()
                    /*instructionObj.recurringInstructionData.endAfterPayments = this.result.dateScheduledProcess;
                     instructionObj.recurringInstructionData.endDate = recipients[i].expirationDate;
                     instructionObj.recurringInstructionData.endDays = recipients[i].expirationDate;
                     instructionObj.recurringInstructionData.startDate = this.result.dateScheduled;
                     instructionObj.recurringInstructionData.nextInstructionDate = recipients[i].expirationDate;*/
                }

                if(recipients[i].instructionId != ''){
                    instructionObj.instructionId = recipients[i].instructionId;
                    instructionObj.instructionType = 'Modify';

                    if(recipients[i].status == this.config.status.Rejected){
                        var recipientStatus = this.updateRecipientStatus.bind(this);
                        instructionObj.instructionType = 'Delete';
                        recipientStatus(recipients[i].recipientId);
                    }
                }else{
                    instructionObj.instructionType = 'Add';
                    if(recipients[i].status == this.config.status.Rejected) instructionObj.instructionType = 'NOADD';
                }
                that.callback(instructionObj);
            }

            this.result.save();
            this.done();
        },
        updateRecipientID: function(channelInstructionId , coreInstructionId){
            var recipientModel = mongoModelName.getModelByModelName(mongoModelName.modelName.BatchRecipient);
            recipientModel.modelObj.findOne({institutionId : this.config.instId, recipientId : channelInstructionId },function(err , recipient){
                recipient.instructionId = coreInstructionId;
                recipient.save();
            });
        },
        updateRecipientStatus: function(recipientId){
            var that = this;
            var recipientModel = mongoModelName.getModelByModelName(mongoModelName.modelName.BatchRecipient);
            recipientModel.modelObj.findOne({institutionId : this.config.instId, recipientId : recipientId },function(err , recipient){
                recipient.status = that.config.status.Deleted;
                recipient.save();
            });
        }
    };

    module.exports = function(config , tnxId){
        return (new Ach(config , tnxId));
    };
})();
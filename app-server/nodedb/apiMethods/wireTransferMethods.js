(function(){

    var moment = require('moment');

    var utils = require('../lib/utils/utils');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var errorResponse = require('../gen/errorResponse');

    var successResponse = require('../gen/successResponseMessage');

    var transactionLimitMethod = require('./transactionLimitsMethods');

    var beneficiaryMethod = require('./beneficiaryMethods');

    var bankMailMethod = require('./bankMailMethods');

    var alertMethod = require('../apiMethods/alertMethods');

    var messenger = require('../lib/emailGenerator/messenger');

    var mailer = require('../lib/emailGenerator/emailMethods');

    var alertWS = require('../server/WsAlerts/vsoftAlertWs');

    var generateId = require('time-uuid/time');


    function WireTransfer(config , tnxId){
        var dated = new Date();
        this.dated = (dated.getMonth() + 1) + "/" + dated.getDate() + "/" + dated.getFullYear().toString().substr(2,2);
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.WireTransfer;
    }

    WireTransfer.prototype = {
        addWireTransfer: function(reqBody , callback){
            this.callback = callback;
            this.reqBody = reqBody;

            var wireId = this.utils.getToken();
            var transactionId = this.utils.getToken();

            this.routed = {
                institutionId       : this.config.instId,
                wireTransferId      : wireId,
                transactionId       : transactionId,
                userId              : reqBody.userId,
                customersId         : reqBody.customersId,
                userName            : reqBody.userSelectedName,
                beneficiaryId       : reqBody.beneficiaryId,
                fromAccount         : reqBody.fromAccount,
                fromAccountType     : reqBody.fromAccountType,
                amount              : reqBody.amount,
                beneficiary         : {},
                scheduledInfo       : reqBody.scheduledInfo,
                recurringNextDate   : new Date(reqBody.scheduledInfo.scheduledDate),
                recurringSchldDate  : new Date(reqBody.scheduledInfo.scheduledDate)
            };

            /*if(this.routed.scheduledInfo.scheduledType == "Recurring"){
             var scheduling = this.getScheduleNextDate.bind(this);
             var schedule = scheduling(this.dated , this.routed.scheduledInfo.frequency);
             if(reqBody.schedule == "Once") schedule = this.routed.scheduledInfo.scheduledDate;

             this.routed.recurringNextDate = new Date(schedule);
             }*/
            //this.routed.scheduledInfo.scheduledDate = new Date(this.routed.scheduledInfo.scheduledDate);

            this.transactionObj = {
                userId                  : reqBody.userId,
                transactionType         : 'Wire',
                transactionAmount       : reqBody.amount
            };

            var transaction = transactionLimitMethod(this.config , this.tnxId);
            var resHandle = this.transactionCheck.bind(this);
            transaction.transactionPerDay(this.transactionObj , resHandle);
        },
        transactionCheck: function(err , success){
            if(err){
                this.callback(err , null);
            }else {
                if (this.routed.beneficiaryId != "default") {
                    var routed = {
                        institutionId: this.config.instId,
                        beneficiaryId: this.routed.beneficiaryId
                    };

                    var beneficiary = beneficiaryMethod(this.config, this.tnxId);
                    var resHandle = this.getBeneficiary.bind(this);
                    beneficiary.defaultMethod(routed, resHandle);
                } else {
                    this.routed.beneficiary = {
                        userId                                  : this.reqBody.userId,
                        beneficiaryName                         : this.reqBody.beneficiaryName,
                        addressLine1                            : this.reqBody.addressLine1,
                        addressLine2                            : this.reqBody.addressLine2,
                        city                                    : this.reqBody.city,
                        state                                   : this.reqBody.state,
                        zip                                     : this.reqBody.zip,
                        country                                 : this.reqBody.country,
                        specialInstruction                      : this.reqBody.specialInstruction,
                        recipientBankInfo                       : this.reqBody.recipientBankInfo,
                        intermediateBank                        : this.reqBody.intermediateBank/*,
                        status                                  : this.reqBody.status*/
                    };
                    var mongo = this.utils.initMongo(this.model ,this.routed , this.tnxId);
                    var resHandle = this.wireTransferAdded.bind(this);
                    mongo.Save(resHandle);
                }
            }
        },
        getBeneficiary: function(err , result){
            if(!result){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.routed.beneficiary = {
                    beneficiaryId                           : result.beneficiaryId,
                    userId                                  : result.userId,
                    beneficiaryName                         : result.beneficiaryName,
                    addressLine1                            : result.addressLine1,
                    addressLine2                            : result.addressLine2,
                    city                                    : result.city,
                    state                                   : result.state,
                    zip                                     : result.zip,
                    country                                 : result.country,
                    specialInstruction                      : result.specialInstruction,
                    recipientBankInfo                       : result.recipientBankInfo,
                    intermediateBank                        : result.intermediateBank,
                    status                                  : result.status
                };
                var mongo = this.utils.initMongo(this.model ,this.routed , this.tnxId);
                var resHandle = this.wireTransferAdded.bind(this);
                mongo.Save(resHandle);
            }
        },
        wireTransferAdded: function(err , result){
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                var wireObj = {
                    wireTransferId: result.wireTransferId,
                    transactionId: result.transactionId,
                    userId: result.userId,
                    beneficiaryId: result.beneficiaryId,
                    fromAccount: result.fromAccount,
                    amount: result.amount,
                    beneficiary:result.beneficiary,
                    scheduledInfo: result.scheduledInfo
                };

                var transaction = transactionLimitMethod(this.config , this.tnxId);
                transaction.addDailyTransactionUpdate(this.transactionObj);

                this.callback(null ,{wireTransfer : wireObj , message: this.successResponse.AddWireTransfer + result.transactionId , otpForService: 'wireTransferNewRequest', nextStep: this.config.nextStepTo.goToWireTransferSuccess });
            }
        },
        listWireTransfers: function(reqBody , callback){
            this.callback = callback;
            var routed  = {
                institutionId           : this.config.instId,
                customersId             : reqBody.customersId
            };
            if(reqBody.status){
                routed.status = reqBody.status;
            }
            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.wireTransfersRetrieval.bind(this);
            mongo.FindMethod(resHandle);
        },
        wireTransfersRetrieval: function(err , result){
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                for(var i = (result.length-1);i >= 0;i--){
                    if(result[i].status == "pending"){
                        if((moment(result[i].scheduledInfo.scheduledDate,"MM/DD/YYYY").diff(moment().startOf("day"),'days')) < 0){
                            result[i].status = "Expired";
                            result[i].save()
                            result.splice(i,1);
                        }
                    }
                }
                this.callback(null , result);
            }
        },
        processWireTransfer : function(reqBody , callback){
            this.callback = callback;
            this.reqBody = reqBody;

            this.bodyLen = reqBody.wireTransferList.length;
            for (var i = 0; i < this.bodyLen; i++) {

                var wireId = reqBody.wireTransferList[i].wireTransferId;
                var routed = {
                    institutionId                   : this.config.instId,
                    wireTransferId                  : wireId
                };

                var done = null;
                if(this.bodyLen == i + 1) done = this.callback;

                var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                var wire = new WireProcess(wireId , this.config , this.tnxId , done , reqBody);
                var resHandle = wire.authorized.bind(wire);
                mongo.FindOneMethod(resHandle);
            }
        },
        deleteWireTransfer : function(reqBody , callback){
            this.callback = callback;

            this.bodyLen = reqBody.wireTransferList.length;

            for (var i = 0; i < this.bodyLen; i++) {

                var wireId = reqBody.wireTransferList[i].wireTransferId;
                var routed = {
                    institutionId                   : this.config.instId,
                    userId                          : reqBody.userId,
                    wireTransferId                  : wireId
                };

                var done = null;
                if(this.bodyLen == i + 1) done = this.callback;

                var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                var wire = new WireProcess(wireId , this.config , this.tnxId , done, reqBody);
                var resHandle = wire.deleteWire.bind(wire);
                mongo.FindOneMethod(resHandle);
            }
        },
        recurringWireTransfer: function(){
            var routed = {
                "institutionId"                       : this.config.instId,
                "scheduledInfo.scheduledType"       : {$in:['Recurring','OneTime']},
                "status"                            : {$in:['scheduled','Processed']},
//                "recurringSchldDate"                : {"$lte" : new Date(this.dated) },
                "recurringNextDate"                 : new Date(this.dated)
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.recurringWireTransferList.bind(this);
            mongo.FindMethod(resHandle);
        },
        recurringWireTransferList: function(err , result){
            for(var i = 0 ; i < result.length; i++){

                if(!(result[i].status == "Processed" && (result[i].scheduledInfo.scheduledType == 'OneTime' || result[i].scheduledInfo.scheduledType == 'Recurring'))) {
                    var processWire = true;
                    var scheduleInfo = result[i].scheduledInfo;
                    var expiryDate = scheduleInfo.expiryDate;

                    if (expiryDate || expiryDate != '') {
                        var dated = new Date(this.dated);
                        var expDate = new Date(expiryDate);
                        if (dated > expDate) processWire = false;
                    }

                    var wireId = result[i].wireTransferId;
                    var routed = {
                        institutionId: this.config.instId,
                        wireTransferId: wireId
                    };

                    var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                    var resHandle = this.sendRecurringWire.bind(this);

                    if (processWire) mongo.FindOneMethod(resHandle);
                }
                if((result[i].scheduledInfo.scheduledType == 'OneTime')){
                    var routed = {
                        institutionId: this.config.instId,
                        wireTransferId : result[i].wireTransferId
                    }
                    var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                    var resHandle = this.changeOneTimeToProcessed.bind(this);
                    mongo.FindOneMethod(resHandle);
                }
                if((result[i].status == "Processed" && result[i].scheduledInfo.scheduledType == 'Recurring')){
                    var routed = {
                        institutionId: this.config.instId,
                        wireTransferId : result[i].wireTransferId
                    }
                    var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                    var resHandle = this.changeRecurringToScheduled.bind(this);
                    mongo.FindOneMethod(resHandle);
                }
            }
        },
        changeOneTimeToProcessed: function(err , result){
            if(result) {
                result.status = "Processed"
                result.save();
            }
        },
        changeRecurringToScheduled: function(err , result){
            if(result) {
                var getSchedule = this.utils.getScheduleNextDate.bind(this);
                var recurringNext = getSchedule(result.recurringSchldDate, result.recurringNextDate, result.scheduledInfo.frequency);
                result.recurringNextDate = new Date(recurringNext);
                result.status = "scheduled"
                result.save();
            }
        },
        sendRecurringWire: function(err , result){
            if(result) {
                var getSchedule = this.utils.getScheduleNextDate.bind(this);
                var recurringNext = getSchedule(result.recurringSchldDate, result.recurringNextDate, result.scheduledInfo.frequency);
                result.recurringNextDate = new Date(recurringNext);
                result.save();

                var wire = new WireProcess(result.wireTransferId, this.config, this.tnxId);
                var resHandle = wire.sendAuthorizedMail.bind(wire);
                resHandle(result);
            }
        }
    };

    var WireProcess = function(wireId ,config , tnxId , done, userData){
        this.tnxId = tnxId;
        this.config = config;
        this.wireId = wireId;
        this.userData = userData;
        this.done = done;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.User;
        this.fundsTransferStatusLog = mongoModelName.modelName.FundsTransferStatusLog;
    };

    WireProcess.prototype = {
        authorized: function(err , result){
            if(!result){
                var error = 'The Following WireTransfer Does not exist. Incorrect wireTransfer Id ' + this.wireId;
                this.utils.log(this.tnxId , error , 'console.log');
                //console.log(error , null);
            }else{
                var that = this;
                this.wireDetails = result;
                var dated = new Date();
                var currentDate = (dated.getMonth() + 1) + "/" + dated.getDate() + "/" + dated.getFullYear().toString().substr(2,2);
                result.status = this.config.status.Scheduled;
                result.authorizedBy = this.userData.userId;
                result.authorizedAt = new Date();

                var mailHandle = this.sendAuthorizedMail.bind(this);
                var nextDated = (new Date(result.recurringNextDate)).getTime();
                var currentDated = (new Date(currentDate)).getTime();
                if(nextDated == currentDated){
                    var getSchedule = this.utils.getScheduleNextDate.bind(this);
                    var frequency = result.scheduledInfo.frequency;
                    if(frequency = '') frequency = 'Daily';
                    var recurringNext = getSchedule(result.recurringSchldDate, result.recurringNextDate, frequency);
                    result.recurringNextDate = new Date(recurringNext);
                    result.status = "Processed";

                    if((result.status == "Processed" && result.scheduledInfo.scheduledType == 'Recurring')) {
                        var d = new Date();
                        var times = this.config.scheduler.time.wireTransferAt
                        var time = times.match(/(\d+)(?::(\d\d))?\s*(p?)/);
                        d.setHours( parseInt(time[1]) + (time[3] ? 12 : 0) );
                        d.setMinutes( parseInt(time[2]) || 0 );
                        if((new Date())>d){
                            var getSchedule = this.utils.getScheduleNextDate.bind(this);
                            var recurringNext = getSchedule(result.recurringSchldDate, result.recurringNextDate, result.scheduledInfo.frequency);
                            result.recurringNextDate = new Date(recurringNext);
                            result.status = "scheduled"
                        }
                    }

                    mailHandle(result);
                }
                result.save();
                var routed = {
                    userId       : this.userData.userId
                }
                var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
                var resHandle = this.userDetailsFind.bind(this);
                mongo.FindOneMethod(resHandle);
                if(that.done) that.done(null , {message : this.successResponse.ProcessWireTransfer});
            }
        },
        userDetailsFind:function(err , result){
            var alertObj = {
                userId       : this.userData.userId,
                emailId      : this.userData.userInform.emailId,
                phoneNo      : this.userData.userInform.phoneNo,
                customerId   : this.userData.customersId,
                createdBy    : result.createdBy,
                originator   : result.originator,
                subject      : "Wire Transfer Request",
                alertMessage : 'When a wire transfer is submitted for processing',
                emailMessage : 'Dear '+this.userData.customersName+',<br><p>Wire transfer request for recipient '+ this.wireDetails.beneficiary.beneficiaryName +' for amount $'+ this.wireDetails.amount +' scheduled for ' + this.wireDetails.scheduledInfo.scheduledDate + ' has been submitted for processing.</p>'
            };

            var alert = alertMethod(this.config , this.tnxId);
            alert.sendAlerts(alertObj);
        },
        sendAuthorizedMail: function(result){
            var mailGenerator = mailer(this.config , this.tnxId);
            var msg = mailGenerator.getEmailMsg(result, 'wireTransfer');

            var vfxRequestId = generateId();
            var requestId = generateId();
            var requestObj = {
                config : this.config,
                requestId: requestId,
                vfxRequestId: vfxRequestId,
                requestBody: {
                    "REQUEST_NAME": "AlertRq",
                    "INSTANCE": {
                        "alertType": 'OTHER',
                        "bankId": this.config.instId,
                        "customerId":'0',
                        "emailInd":true,
                        "smsInd":false,
                        "emailAddress":this.config.customerDataInfoSendTo,
                        "subject": "Wire Transfer",
                        "message": msg,
                        "userId":this.userData.userId,
                        "requestId": requestId,
                        "vfxRequestId": vfxRequestId
                    }
                }
            };
            //!***** Transfer Log Start *****!//
            var isScheduledTransaction = result.scheduledInfo.scheduledType == "OneTime" ? false : true;
            var logRouted = {
                transactionDate  : (new Date()),
                institutionId    : result.institutionId,
                customerId       : result.customersId,
                userId           : result.userId,
                fromAccountNo    : result.fromAccount,
                fromAccountType  : result.fromAccountType,
                amount           : result.amount,
                toAccountNo      : result.beneficiary.recipientBankInfo.accountNo,
                frequency        : ((result.scheduledInfo.frequency!=undefined||result.scheduledInfo.frequency!=null)?String(result.scheduledInfo.frequency).toUpperCase():""),
                status           : "Processed",
                transactionType  : 'WIRE',
                isScheduledTransaction : isScheduledTransaction
            }
            var logRoutedMongo = this.utils.initMongo(this.fundsTransferStatusLog ,logRouted , this.tnxId);
            logRoutedMongo.Save();
            //!***** Transfer Log End *****!//
            var validateResponse = function(error , response){};


            var ws = alertWS(requestObj , validateResponse);
            ws.requestVsoftAlertServer();

            /*var sendingTo = {
             subject: "Wire Transfer"
             };
             var postOffice = messenger(this.config , this.tnxId);
             postOffice.sendMessage(sendingTo, result , 'wireTransfer');
             */
            var wireBankMail = {
                wireTransferId      : result.wireTransferId,
                transactionId       : result.transactionId,
                userId              : result.userId,
                userSelectedName    : result.userName,
                beneficiaryId       : result.beneficiaryId,
                fromAccount         : result.fromAccount,
                amount              : result.amount,
                beneficiary         : result.beneficiary,
                scheduledInfo       : result.scheduledInfo,
                recurringNextDate   : result.recurringNextDate
            };

            var bankMail = bankMailMethod(this.config , this.tnxId);
            bankMail.addWireTransfer(wireBankMail);
        },
        deleteWire: function(err , result){
            if(!result){
                var error = 'The Following WireTransfer Does not exist. Incorrect wireTransfer Id ' + this.wireId;
                this.utils.log(this.tnxId , error , 'console.log');
            }else{
                result.status = this.config.status.Deleted;
                result.authorizedBy = this.userData.userId;
                result.authorizedAt = new Date();
                result.save();
                var that = this;
                if(that.done){
                    that.done(null , {message : this.successResponse.RemoveWireTransfer});
                }
            }
        }
    };

    module.exports = function(config , tnxId){
        return (new WireTransfer(config , tnxId));
    };
})();
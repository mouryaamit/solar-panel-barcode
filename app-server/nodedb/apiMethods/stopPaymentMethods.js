(function(){

    var moment = require('moment');

    var utils = require('../lib/utils/utils');

    var errorResponse = require('../gen/errorResponse');

    var successResponse = require('../gen/successResponseMessage');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var stopPaymentCore = require('../server/coreMethods/stopPaymentCore');

    var generateId = require('time-uuid/time');

    function StopPayment(config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        var dated = new Date();
        this.dated = (dated.getMonth() + 1) + "/" + dated.getDate() + "/" + dated.getFullYear().toString().substr(2,2);
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.StopPayment;
        this.finalPaymentList = null || [];
    }

    StopPayment.prototype = {
        addStopPayment: function(reqBody , callback){
            this.callback = callback;
            //this.overrideStatus = ((reqBody.isOverride!=undefined && reqBody.isOverride==false)?true:false);
            var currentDate = new Date(this.dated);
            currentDate.setMonth(currentDate.getMonth()+6);
            var expDate = ("0" + (currentDate.getMonth() + 1)).slice(-2)+'/'+("0" + currentDate.getDate()).slice(-2)+'/'+currentDate.getFullYear();
            this.routed = {
                institutionId       : this.config.instId,
                customerId          : reqBody.customersId,
                instructionId       : '',
                userId              : reqBody.userId,
                stopPaymentId       : this.utils.getToken(),
                accountNo           : reqBody.accountNo,
                paymentType         : reqBody.paymentType,
                transaction         : reqBody.transaction,
                checkInfo           : reqBody.checkInfo,
                achInfo             : reqBody.achInfo,
                reason              : reqBody.reason,
                comments            : reqBody.comments,
                payee               : reqBody.payee,
                isOverride          : reqBody.isOverride,
                expirationDate      : expDate,
                status              : 'Success'
            };

            var payment = stopPaymentCore.StopPayment(this.routed , this.config , this.tnxId);
            var resHandle = this.paymentAdd.bind(this);
            payment.coreCaller(resHandle);
        },
        paymentAdd: function(err , result){
            if(err){
                if(!this.config.systemConfiguration.client.pagewiseConfig.stopPay.overrideCheck) {
                    this.callback(err, null);
                } else {
                    if (err.overrideStatus == 0) {
                        this.callback(err, null);
                    } else {
                        //this.callback(null, {message: err.message, overrideStatus: err.overrideStatus});
                        var overrideStatus = err.responseData.overrideStatus;
                        if(overrideStatus==undefined)
                            overrideStatus=false;

                        if(overrideStatus==false){
                            this.callback({
                                status: 400,
                                responseData: {
                                    message: err.responseData.message,
                                    overrideStatus: overrideStatus
                                }
                            },null);
                        }
                        else {
                            this.callback(null, {
                                message: err.responseData.message,
                                overrideStatus: overrideStatus
                            });
                        }
                    }
                }
            }else{
                this.routed.instructionId = result.responseObj.instructionId;
                var resHandle = this.paymentCreated.bind(this);
                var mongo = this.utils.initMongo(this.model, this.routed, this.tnxId);
                mongo.Save(resHandle);
            }
        },
        paymentCreated: function(err , result){
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.callback(null , {message: this.successResponse.AddStopPayment , otpForService: 'stopPayment', nextStep: this.config.nextStepTo.goToStopPaymentList });
            }
        },
        listPayments: function(reqBody , callback){
            this.callback = callback;
            this.reqBody = reqBody;
            var routed = {
                institutionId       : this.config.instId,
                userId              : reqBody.userId,
                expirationDate      : {$gte : new Date(this.dated) },
                paymentType         : "ACH"
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.paymentACHListReturn.bind(this);
            mongo.FindMethod(resHandle);
        },
        paymentACHListReturn: function(err , result){
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.finalPaymentList = result;
                //this.callback(null , result);
                var routed = {
                    partyId : this.reqBody.customersId,
                    accounts : this.reqBody.accounts
                };
                var payment = stopPaymentCore.StopPayment(routed , this.config , this.tnxId);
                var resHandle = this.paymentListReturn.bind(this);
                payment.getCheckList(resHandle);
            }
        },
        paymentListReturn: function(err , result) {
            if (err) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                this.stopPaymentData = result.INSTANCE.stopPaymentData;

                var routed = {
                    institutionId       : this.config.instId,
                    userId              : this.reqBody.userId
                };

                userModel = mongoModelName.modelName.User;
                var mongo = this.utils.initMongo(userModel ,routed , generateId());
                var resHandle = this.filterListByAccounts.bind(this);
                mongo.FindOneMethod(resHandle);
            }
        },
        filterListByAccounts: function(err, result){
            if(err){
                this.callback(null , this.finalPaymentList);
            }
            else {
                var isSubUser = this.utils.isSubUser(result.createdBy,result.originator);
                if(isSubUser) {
                    var userAccounts = result.privilege.access.accountsAccess;
                    var userAccountCount = userAccounts.length;
                    var stopPaymentDataLength = this.stopPaymentData.length;
                    for (var i = 0; i < stopPaymentDataLength; i++) {
                        var accountNo = this.stopPaymentData[i].accountNo;
                        for (var j = 0; j < userAccountCount; j++) {
                            if (userAccounts[j].accountNo == accountNo) {
                                var temp = {
                                    paymentType: "CHECK",//result[i].sourceType.toUpperCase(),
                                    expirationDate: this.stopPaymentData[i].expirationDate,
                                    instructionId: this.stopPaymentData[i].instructionId,
                                    accountNo: this.stopPaymentData[i].accountNo,
                                    checkInfo: {
                                        checkNumber: {
                                            checkNoFrom: this.stopPaymentData[i].lowCheckNo,
                                            checkNoTo: this.stopPaymentData[i].highCheckNo
                                        },
                                        amount: {
                                            amountFrom: this.stopPaymentData[i].lowAmount,
                                            amountTo: this.stopPaymentData[i].HighAmount
                                        }
                                    },
                                    payee: this.stopPaymentData[i].payee,
                                    reason: this.stopPaymentData[i].reason
                                };
                                this.finalPaymentList.push(temp)
                            }
                        }
                    }

                    this.callback(null, this.finalPaymentList);
                } else {
                    var stopPaymentDataLength = this.stopPaymentData.length;
                    for(var i = 0 ; i < stopPaymentDataLength ; i++){
                        var temp = {
                            paymentType : "CHECK",//result[i].sourceType.toUpperCase(),
                            expirationDate:this.stopPaymentData[i].expirationDate,
                            instructionId: this.stopPaymentData[i].instructionId,
                            accountNo:this.stopPaymentData[i].accountNo,
                            checkInfo:{
                                checkNumber:{
                                    checkNoFrom:this.stopPaymentData[i].lowCheckNo,
                                    checkNoTo:this.stopPaymentData[i].highCheckNo
                                },
                                amount:{
                                    amountFrom:this.stopPaymentData[i].lowAmount,
                                    amountTo:this.stopPaymentData[i].HighAmount
                                }
                            },
                            payee:this.stopPaymentData[i].payee,
                            reason:this.stopPaymentData[i].reason
                        }
                        this.finalPaymentList.push(temp)

                    }
                    this.callback(null , this.finalPaymentList);
                }
            }
        },
        deletePayments: function(reqBody , callback){
            this.callback = callback;
            this.routed = {
                institutionId       : this.config.instId,
                customerId          : reqBody.customersId,
                instructionId       : reqBody.stopPayList[0].instructionId,
                userId              : reqBody.userId,
                stopPaymentId       : this.utils.getToken(),
                accountNo           : reqBody.stopPayList[0].accountNo,
                paymentType         : reqBody.stopPayList[0].paymentType,
                transaction         : reqBody.stopPayList[0].transaction,
                checkInfo           : reqBody.stopPayList[0].checkInfo,
                achInfo             : reqBody.stopPayList[0].achInfo,
                reason              : reqBody.stopPayList[0].reason,
                comments            : reqBody.stopPayList[0].reason,
                payee               : reqBody.stopPayList[0].payee,
                isOverride          : reqBody.stopPayList[0].isOverride,
                expirationDate      : reqBody.stopPayList[0].expirationDate,
                status              : 'Success'
            };

            var payment = stopPaymentCore.StopPayment(this.routed , this.config , this.tnxId);
            var resHandle = this.paymentDeleteNext.bind(this);
            payment.deleteCoreCaller(resHandle);
        },

        paymentDeleteNext: function(err , result){
            if(err){
                console.error(err)
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.callback(null , {message: this.successResponse.DeleteStopPayment ,nextStep: this.config.nextStepTo.goToStopPaymentList });
            }
        },

    };


    module.exports = function(config , tnxId){
        return (new StopPayment(config , tnxId));
    };
})();
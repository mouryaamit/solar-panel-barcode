(function(){

    var utils = require('../lib/utils/utils');

    var errorResponse = require('../gen/errorResponse');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var messenger = require('../lib/emailGenerator/messenger');

    var generateId = require('time-uuid/time');

    var alertWS = require('../server/WsAlerts/vsoftAlertWs');

    var schema = require('../gen/coreResponseSchema');

    var validate = require('../gen/coreResponseValidate');

    var Otp = function(config , tnxId){
        this.config = config;
        this.tnxId = tnxId;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.SessionOtp;
        this.userModel = mongoModelName.modelName.User;
        this.forgotOtpModel = mongoModelName.modelName.ForgotPasswordOtp;
    };

    Otp.prototype = {
        createOTP: function(reqBody , callback){
            this.callback = callback;

            this.otpObj = {
                institutionId       : this.config.instId,
                userId              : reqBody.userId,
                otp                 : this.utils.getOtp(),
                otpForService       : reqBody.otpService,
                sessionId           : reqBody.sessionId,
                requestData         : reqBody,
                sendThroughEmail    : reqBody.otpData.sendThroughEmail,
                sendThroughSms      : reqBody.otpData.sendThroughPhone
            };

            var sessionOtpModel = mongoModelName.getModelByModelName(this.model);
            var resHandle = this.sendOtpResponse.bind(this);
            sessionOtpModel.modelObj.update({institutionId : this.config.instId, sessionId : reqBody.sessionId, otpForService : reqBody.otpService }, { $set: this.otpObj }, { upsert: true }, resHandle);
        },
        createForgotOTP: function(reqBody, callback){

            this.callback = callback;

            this.otpObj = {
                institutionId       : this.config.instId,
                userId              : reqBody.userId,
                otpForService       : 'forgotPassword',
                otp                 : this.utils.getOtp(),
                requestData         : reqBody,
                sendThroughEmail    : reqBody.otpData.sendThroughEmail,
                sendThroughSms      : reqBody.otpData.sendThroughPhone
            };

            var sessionOtpModel = mongoModelName.getModelByModelName(this.forgotOtpModel);
            var resHandle = this.sendOtpResponse.bind(this);
            sessionOtpModel.modelObj.update({institutionId : this.config.instId, userId : reqBody.userId }, { $set: this.otpObj }, { upsert: true }, resHandle);
        },
        sendOtpResponse: function(err, result){
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                //this.sendOtp();
                //this.callback(null , {message:'Otp has been sent to your registered email/phone.' , response: {otpForService : this.otpObj.otpForService}, nextStep: this.config.nextStepTo.goToOTP });
                var routed = {
                    institutionId : this.config.instId,
                    userId:this.otpObj.requestData.userId
                };
                var mongo = this.utils.initMongo(this.userModel ,routed , this.tnxId);
                var resHandle = this.findUser.bind(this);
                mongo.FindOneMethod(resHandle);
            }
        },
        findUser: function(err, result) {
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.createdBy = result.createdBy;
                this.originator = result.originator;
                this.userId = result.userId;
                this.phoneNo = result.contact.phoneNo;
                this.customerName = result.customerName;
                this.customerId = result.customerId;
                this.callback(null , {message:'Otp has been sent to your registered email/phone.' , response: {otpForService : this.otpObj.otpForService, forgotPassOtpUserId : this.userId}, nextStep: this.config.nextStepTo.goToOTP });
                this.sendOtp();
            }
        },
        sendOtp: function(){

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
                        "customerId":this.customerId,
                        "emailInd":this.otpObj.sendThroughEmail,
                        "smsInd":this.otpObj.sendThroughSms,
                        "subject": "Otp",
                        "message": '<p>Dear '+this.customerName+',</p><p>One time password (OTP) for your transaction is ' + this.otpObj.otp + '</p><p>Bank never calls to verify your OTP. Do not disclose OTP to anyone.</p>',
                        "userId":this.userId,
                        "requestId": requestId,
                        "vfxRequestId": vfxRequestId
                    }
                }
            };

            if(this.utils.isSubUser(this.createdBy,this.originator)){
                requestObj.requestBody.INSTANCE.emailAddress = this.otpObj.requestData.otpData.emailId;
                requestObj.requestBody.INSTANCE.phoneNo = this.phoneNo;
            }
            var validateResponse = function(error , response){};
            var ws = alertWS(requestObj , validateResponse);
            ws.requestVsoftAlertServer();

            /*var sendingTo = {
             subject: 'OTP Authentication',
             emailId: this.otpObj.requestData.otpData.emailId
             };

             var postOffice = messenger(this.config , this.tnxId);
             postOffice.sendMessage(sendingTo, this.otpObj, 'otpAuthFactor');*/
        },
        validateForgotPasswordOtp: function(reqBody, callback){
            this.callback = callback;

            var rQuery = {
                institutionId       : this.config.instId,
                userId              : reqBody.userId,
                otp                 : reqBody.otp
            };

            var mongo = this.utils.initMongo(this.forgotOtpModel, rQuery, this.tnxId);
            mongo.FindOneMethod(callback);
        },
        validateOtp: function(reqBody, callback){
            this.callback = callback;

            var rQuery = {
                institutionId       : this.config.instId,
                sessionId           : reqBody.sessionId,
                otpForService       : reqBody.otpService,
                otp                 : reqBody.otp
            };

            var mongo = this.utils.initMongo(this.model, rQuery, this.tnxId);
            var resHandle = this.redirectOtpHandler.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        redirectOtpHandler: function(err, result){
            var error = this.errorResponse.OTPServiceNotRegisteredFailed;
            if(!result){
                error = this.errorResponse.IncorrectOTPFailed;
                this.callback(error , null);
            }else{
                var otpRedirectObj = result;
                this.removeOtp(result);

                var userMethod = require('../apiMethods/userMethods');
                var customerMethod = require('../apiMethods/customerMethods');
                var wireTransferMethod = require('../apiMethods/wireTransferMethods');
                var beneficiaryMethod = require('../apiMethods/beneficiaryMethods');
                var batchMethod = require('../apiMethods/batchMethods');
                var orderCheckMethod = require('../apiMethods/orderCheckMethods');
                var stopPaymentMethod = require('../apiMethods/stopPaymentMethods');

                var otpRedirect = userMethod(this.config , this.tnxId);
                switch(otpRedirectObj.otpForService){
                    case 'firstLogin' :
                        otpRedirect.firstTimeLoginChange(otpRedirectObj.requestData, this.callback);
                        break;
                    case 'multiFactorAuthentication' :
                        otpRedirect.verifyMFAQuestion(otpRedirectObj.requestData, this.callback);
                        break;
                    case 'statements' :
                        otpRedirect = customerMethod(this.config , this.callback , this.tnxId);
                        otpRedirect.statementDownload(otpRedirectObj.requestData);
                        break;
                    case 'wireTransferNewBeneficiary' :
                        otpRedirect = beneficiaryMethod(this.config , this.tnxId);
                        otpRedirect.addBeneficiary(otpRedirectObj.requestData, this.callback);
                        break;
                    case 'wireTransferNewRequest' :
                        otpRedirect = wireTransferMethod(this.config , this.tnxId);
                        otpRedirect.addWireTransfer(otpRedirectObj.requestData, this.callback);
                        break;
                    case 'achNewBatch' :
                        otpRedirect = batchMethod(this.config , this.tnxId);
                        otpRedirect.addBatch(otpRedirectObj.requestData, this.callback);
                        break;
                    case 'achBatchAuthorization' :
                        otpRedirect = batchMethod(this.config , this.tnxId);
                        otpRedirect.authorizeBatch(otpRedirectObj.requestData, this.callback);
                        break;
                    case 'orderChecks' :
                        otpRedirect = orderCheckMethod(this.config , this.tnxId);
                        otpRedirect.addRequestCheck(otpRedirectObj.requestData, this.callback);
                        break;
                    case 'stopPayment' :
                        otpRedirect = stopPaymentMethod(this.config , this.tnxId);
                        otpRedirect.addStopPayment(otpRedirectObj.requestData, this.callback);
                        break;
                    case 'changePassword' :
                        otpRedirect.changeUserPassword(otpRedirectObj.requestData, this.callback);
                        break;
                    case 'changeSecurityQuestion' :
                        otpRedirect.changeSecurityQuestion(otpRedirectObj.requestData, this.callback);
                        break;
                    case 'fundsTransfer' :
                        otpRedirect = customerMethod(this.config , this.callback , this.tnxId);
                        otpRedirect.processFundsTransferAfterOtp(otpRedirectObj.requestData);
                        break;
                    default: this.callback(error , null);
                        break;
                }

                return true;
            }
        },
        removeOtp: function(otpData){
            var otpObj = {
                institutionId       : this.config.instId,
                sessionId           : otpData.sessionId,
                otpForService       : otpData.otpForService
            };

            var mongo = this.utils.initMongo(this.model, otpObj, this.tnxId);
            mongo.Remove();
        },
        defaultMethod: function(rQuery , callback){
            var mongo = this.utils.initMongo(this.model, rQuery, this.tnxId);
            mongo.FindOneMethod(callback);
        }
    };

    module.exports = function(config , tnxId){
        return (new Otp(config , tnxId));
    };
})();
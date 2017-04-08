(function(){

    var utils = require('../lib/utils/utils');

    var errorResponse = require('../gen/errorResponse');

    var successResponse = require('../gen/successResponseMessage');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    function OtpConfig(config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.OtpConfiguration;
    }

    OtpConfig.prototype = {
        addOtpConfig: function(reqBody , callback){
            this.callback = callback;

            var routed = {
                institutionId                       : this.config.instId,
                forgotPassword                      : reqBody.forgotPassword,
                firstLogin                          : reqBody.firstLogin,
                multiFactorAuthentication           : reqBody.multiFactorAuthentication,
                statements                          : reqBody.statements,
                wireTransferNewBeneficiary          : reqBody.wireTransferNewBeneficiary,
                wireTransferNewRequest              : reqBody.wireTransferNewRequest,
                achNewBatch                         : reqBody.achNewBatch,
                achBatchAuthorization               : reqBody.achBatchAuthorization,
                orderChecks                         : reqBody.orderChecks,
                stopPayment                         : reqBody.stopPayment,
                changePassword                      : reqBody.changePassword,
                changeSecurityQuestion              : reqBody.changeSecurityQuestion,
                sendThroughEmail                    : reqBody.sendThroughEmail,
                sendThroughPhone                    : reqBody.sendThroughPhone,
                fundsTransfer					    : reqBody.fundsTransfer
            };


            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.otpCreated.bind(this);
            mongo.Save(resHandle);
        },
        otpCreated: function(err , result){
            if(err){
                var error = this.errorResponse.ConfigurationFailed;
                this.callback(error , null);
            }else{
                this.callback(null , {message: this.successResponse.ConfigurationAdded});
            }
        },
        editOtpConfig: function(reqBody , callback){
            this.callback = callback;

            this.reqBody = reqBody;
            var routed = {
                institutionId       : this.config.instId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.editComplete.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        editComplete: function(err , result){
            if(!result){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                result.forgotPassword = this.reqBody.forgotPassword;
                result.firstLogin = this.reqBody.firstLogin;
                result.multiFactorAuthentication = this.reqBody.multiFactorAuthentication;
                result.statements = this.reqBody.statements;
                result.wireTransferNewBeneficiary = this.reqBody.wireTransferNewBeneficiary;
                result.wireTransferNewRequest = this.reqBody.wireTransferNewRequest;
                result.achNewBatch = this.reqBody.achNewBatch;
                result.achBatchAuthorization = this.reqBody.achBatchAuthorization;
                result.orderChecks = this.reqBody.orderChecks;
                result.stopPayment = this.reqBody.stopPayment;
                result.changePassword = this.reqBody.changePassword;
                result.changeSecurityQuestion = this.reqBody.changeSecurityQuestion;
                result.sendThroughEmail = this.reqBody.sendThroughEmail;
                result.sendThroughPhone = this.reqBody.sendThroughPhone;
                result.fundsTransfer	= this.reqBody.fundsTransfer;

                result.save();
                this.callback(null , {message: this.successResponse.ConfigurationUpdated});
            }
        },
        showOtpConfig: function(reqBody, callback){
            this.callback = callback;

            var routed = {
                institutionId       : this.config.instId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.sendOtpConfig.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        sendOtpConfig: function(err , result){
            if(!result) result = {};

            this.callback(null , result);
        },
        isOtpConfigAvailable: function(otpService, callback){
            this.callback = callback;
            this.otpService = otpService;

            var routed = {
                institutionId       : this.config.instId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.checkIfOtpRequired.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        checkIfOtpRequired: function(err , result){
            var parsedResult = JSON.parse(JSON.stringify(result));

            if(!result){
                this.callback(false , result);
            }else{
                this.callback(parsedResult[this.otpService] , result);
            }
        }
    };

    module.exports = function(config , tnxId){
        return (new OtpConfig(config , tnxId));
    };
})();
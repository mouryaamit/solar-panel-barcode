(function(){

    var routingNumberMethod = require('./routingNumberMethods');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var errorResponse = require('../gen/errorResponse');

    var successResponse = require('../gen/successResponseMessage');

    function Beneficiary(config , tnxId){
        var utils = require('../lib/utils/utils');
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.Beneficiary;
    }

    Beneficiary.prototype = {
        addBeneficiary: function(reqBody , callback){
            this.callback = callback;

            var beneficiaryId = this.utils.getToken();

            this.intermediateBank = reqBody.intermediateBank;
            this.routed = {
                institutionId                           : this.config.instId,
                beneficiaryId                           : beneficiaryId,
                userId                                  : reqBody.userId,
                beneficiaryName                         : reqBody.beneficiaryName,
                addressLine1                            : reqBody.addressLine1,
                addressLine2                            : reqBody.addressLine2,
                city                                    : reqBody.city,
                state                                   : reqBody.state,
                zip                                     : reqBody.zip,
                country                                 : reqBody.country,
                specialInstruction                      : reqBody.specialInstruction,
                recipientBankInfo                       : reqBody.recipientBankInfo,
                intermediateBank                        : reqBody.intermediateBank,
                scheduledInfo                           : reqBody.scheduledInfo
            };

            var resHandle = this.routingNumberCheck.bind(this);
            this.forwardFunc = this.addBeneficiaryToDb.bind(this);
            this.checkRoutingInfo(this.routed.recipientBankInfo.bankRoutingNo , resHandle);
        },
        routingNumberCheck: function(err , result){
            if(!result){
                var error = this.errorResponse.RoutingNumberFailed;
                this.callback(error , null);
            }else{
                if(this.intermediateBank.bankRoutingNo != '') {
                    this.checkRoutingInfo(this.intermediateBank.bankRoutingNo , this.forwardFunc);
                }else{
                    this.forwardFunc(null , true);
                }
            }
        },
        checkRoutingInfo: function(routingNo , resHandle){
            var routingNumber = routingNumberMethod(this.config , this.tnxId);
            routingNumber.checkRoutingNo(routingNo , resHandle, "wire");
        },
        addBeneficiaryToDb: function(err , result){
            if(!result){
                var error = this.errorResponse.IntermediateRoutingNumberFailed;
                this.callback(error , null);
            }else{
                var mongo = this.utils.initMongo(this.model, this.routed, this.tnxId);
                var resHandle = this.beneficiaryAdded.bind(this);
                mongo.Save(resHandle);
            }
        },
        beneficiaryAdded: function(err , result){
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.callback(null , {message: this.successResponse.AddBeneficiary , otpForService: 'wireTransferNewBeneficiary', nextStep: this.config.nextStepTo.goToListBeneficiary });
            }
        },
        editBeneficiary : function(reqBody , callback){
            this.callback = callback;

            this.beneficiaryName= reqBody.beneficiaryName;
            this.addressLine1 = reqBody.addressLine1;
            this.addressLine2 = reqBody.addressLine2;
            this.city = reqBody.city;
            this.state = reqBody.state;
            this.zip = reqBody.zip;
            this.country = reqBody.country;
            this.specialInstruction = reqBody.specialInstruction;
            this.recipientBankInfo = reqBody.recipientBankInfo;
            this.intermediateBank = reqBody.intermediateBank;

            this.routed = {
                institutionId           : this.config.instId,
                userId                  : reqBody.userId,
                beneficiaryId           : reqBody.beneficiaryId
            };

            var resHandle = this.routingNumberCheck.bind(this);
            this.forwardFunc = this.updateBeneficiaryToDb.bind(this);
            this.checkRoutingInfo(this.recipientBankInfo.bankRoutingNo , resHandle);
        },
        updateBeneficiaryToDb: function(err , result){
            if(!result){
                var error = this.errorResponse.IntermediateRoutingNumberFailed;
                this.callback(error , null);
            }else{
                var mongo = this.utils.initMongo(this.model ,this.routed , this.tnxId);
                var resHandle = this.beneficiaryEdited.bind(this);
                mongo.FindOneMethod(resHandle);
            }
        },
        beneficiaryEdited: function(err , result){
            if(!result){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                result.beneficiaryName= this.beneficiaryName;
                result.addressLine1 = this.addressLine1;
                result.addressLine2 = this.addressLine2;
                result.city = this.city;
                result.state = this.state;
                result.zip = this.zip;
                result.country = this.country;
                result.specialInstruction = this.specialInstruction;
                result.recipientBankInfo = this.recipientBankInfo;
                result.intermediateBank = this.intermediateBank;

                result.save();
                this.callback(null , {message: this.successResponse.UpdateBeneficiary, nextStep: this.config.nextStepTo.goToListBeneficiary });
            }
        },
        listBeneficiary: function(reqBody , callback){
            this.callback = callback;

            var routed  = {
                institutionId           : this.config.instId,
                userId                  : reqBody.userId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.beneficiaryRetrieval.bind(this);
            mongo.FindMethod(resHandle);
        },
        beneficiaryRetrieval: function(err , result){
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.callback(null , result);
            }
        },
        deleteBeneficiary: function(reqBody , callback){
            this.callback = callback;

            this.beneficiaryDel = 0;
            this.bodyLen = reqBody.beneficiaryList.length;

            for (var i = 0; i < this.bodyLen; i++) {

                var beneficiaryId = reqBody.beneficiaryList[i].beneficiaryId;
                var routed = {
                    institutionId           : this.config.instId,
                    userId                  : reqBody.userId,
                    beneficiaryId           : beneficiaryId
                };

                var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                var resHandle = this.deleteComplete.bind(this);
                mongo.Remove(resHandle);
            }
        },
        deleteComplete: function(done){
            this.beneficiaryDel = this.beneficiaryDel + 1;

            if(!done){
                var error = this.errorResponse.OperationFailed;
                this.utils.log(this.tnxId , error , 'console.log');
                //console.log(error , null);
            }else{

                if(this.beneficiaryDel == this.bodyLen){
                    this.callback(null , {message : this.successResponse.RemoveBeneficiary});
                }
            }
        },
        defaultMethod: function(routed , callback){
            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            mongo.FindOneMethod(callback);
        }
    };

    module.exports = function(config , tnxId){
        return (new Beneficiary(config , tnxId));
    };
})();
(function(){



    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var errorResponse = require('../gen/errorResponse');

    var successResponse = require('../gen/successResponseMessage');

    var accountInquiry = require('../server/coreMethods/accountInquiryCore');

    var customerMethod = require('../apiMethods/customerMethods');

    function ThirdPartyBeneficiary(config , tnxId){
        var utils = require('../lib/utils/utils');
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.ThirdPartyBeneficiary;
    }

    ThirdPartyBeneficiary.prototype = {
        checkDetailsForAdd: function(reqBody , callback){
            this.callback = callback;
            this.reqBody = reqBody;

            var rBody = {
                accountNo: reqBody.recipientBankAcc
            }
            var inquiry = accountInquiry.AccountInquiry(rBody , this.config , this.tnxId);
            var resHandle = this.thirdPartyBeneficiaryAddedX.bind(this);
            inquiry.coreCaller(resHandle);
             },
        thirdPartyBeneficiaryAddedX: function(err , result){
            if(err){
                var error = this.errorResponse['1001'];
                this.callback(error , null);
            }else{
                if(result.accountSummaryData.accountType == "SAVINGS" || result.accountSummaryData.accountType == "CHECKING" || result.accountSummaryData.accountType == "REAL_ESTATE_LOAN" || result.accountSummaryData.accountType == "INSTALLMENT_LOAN" || result.accountSummaryData.accountType == "COMMERCIAL_LOAN" || result.accountSummaryData.accountType == "CONSTRUCTION_LOAN" || result.accountSummaryData.accountType == "USER_DEFINED_LOAN"){
                    if(result.accountSummaryData.accountStatus=="CLOSED_ACCOUNT"){
                        var error = this.errorResponse.AccountNotAllowedForTransfer;
                        this.callback(error , null);
                    }
                    else {
                        this.accountInqRes = result;
                        if (this.accountInqRes.accountSummaryData.primaryAccountOwner.customer.customerId == this.reqBody.customersId) {
                            var error = this.errorResponse.OwnAccountNotAllowedAsRecipient;
                            this.callback(error, null);
                        } else {
                            if (this.reqBody.beneficiaryNameCheck) {
                                var fullName = this.accountInqRes.accountSummaryData.primaryAccountOwner.customer.fullName.toLowerCase();
                                var customerId = this.accountInqRes.accountSummaryData.primaryAccountOwner.customer.customerId;
                                if(this.accountInqRes.accountSummaryData.primaryAccountOwner.customer.customerType == "Commercial") {
                                    fullName = this.accountInqRes.accountSummaryData.primaryAccountOwner.customer.organizationName.toLowerCase();
                                }
                                var beneficiaryName = this.reqBody.beneficiaryName.toLowerCase();
                                var arrfullName = fullName.split(' ');
                                var beneficiaryNameArr = beneficiaryName.split(' ');
                                var nameCheck = true;
                                for(var i in beneficiaryNameArr) {
                                    var isWordNotExists = arrfullName.indexOf(beneficiaryNameArr[i]) == -1 ;
                                    if(isWordNotExists) {
                                        nameCheck = false;
                                        break;
                                    }
                                }

                                if (nameCheck) {
                                    this.addThirdPartyBeneficiary(this.reqBody, this.callback);
                                } else {
                                    this.callback(null, {
                                        message: "",
                                        fullName: fullName,
                                        customerId: customerId,
                                        nextStep: this.config.nextStepTo.goToCheckThirdPartyBeneficiaryName
                                    });
                                }
                            } else {
                                this.addThirdPartyBeneficiary(this.reqBody, this.callback);
                            }
                        }
                    }
                } else {
                    var error = this.errorResponse.AccountNotAllowedForTransfer;
                    this.callback(error , null);
                }
            }
        },
        addThirdPartyBeneficiary: function(reqBody , callback){
            this.callback = callback;

            var thirdPartyBeneficiaryId = this.utils.getToken();

            this.routed = {
                institutionId                          : this.config.instId,
                thirdPartyBeneficiaryId                : thirdPartyBeneficiaryId,
                userId                                 : reqBody.userId,
                beneficiaryName                        : reqBody.beneficiaryName,
                recipientBankAcc                       : reqBody.recipientBankAcc,
                accountType                            : this.accountInqRes.accountSummaryData.accountType,
                customerId                            : this.accountInqRes.accountSummaryData.primaryAccountOwner.customer.customerId
            };

            var mongo = this.utils.initMongo(this.model, this.routed, this.tnxId);
            var resHandle = this.thirdPartyBeneficiaryAdded.bind(this);
            mongo.Save(resHandle);
        },
        thirdPartyBeneficiaryAdded: function(err , result){
            if(err){
                var error = this.errorResponse.AccountAlreadyExist;
                this.callback(error , null);
            }else{
                this.callback(null , {message: this.successResponse.AddThirdPartyBeneficiary ,otpForService: 'thirdPartyNewBeneficiary', nextStep:'fundsTransfer',response:result});

            }
        },
        checkDetailsForEdit: function(reqBody , callback){
            this.callback = callback;
            this.reqBody = reqBody;

            var rBody = {
                accountNo: reqBody.recipientBankAcc
            }
            var inquiry = accountInquiry.AccountInquiry(rBody , this.config , this.tnxId);
            var resHandle = this.editThirdPartyBeneficiaryX.bind(this);
            inquiry.coreCaller(resHandle);
        },
        editThirdPartyBeneficiaryX: function(err , result){
            if(err){
                var error = this.errorResponse['1001'];
                this.callback(error , null);
            }else{
                if(result.accountSummaryData.accountType == "SAVINGS" || result.accountSummaryData.accountType == "CHECKING" || result.accountSummaryData.accountType == "REAL_ESTATE_LOAN" || result.accountSummaryData.accountType == "INSTALLMENT_LOAN" || result.accountSummaryData.accountType == "COMMERCIAL_LOAN" || result.accountSummaryData.accountType == "CONSTRUCTION_LOAN" || result.accountSummaryData.accountType == "USER_DEFINED_LOAN"){

                    if(result.accountSummaryData.accountStatus=="CLOSED_ACCOUNT"){
                        var error = this.errorResponse.AccountNotAllowedForTransfer;
                        this.callback(error , null);
                    }
                    else {
                        this.accountInqRes = result;
                        if (this.accountInqRes.accountSummaryData.primaryAccountOwner.customer.customerId == this.reqBody.customersId) {
                            var error = this.errorResponse.OwnAccountNotAllowedAsRecipient;
                            this.callback(error, null);
                        } else {
                            if (this.reqBody.beneficiaryNameCheck) {
                                var fullName = this.accountInqRes.accountSummaryData.primaryAccountOwner.customer.fullName.toLowerCase();
                                if(this.accountInqRes.accountSummaryData.primaryAccountOwner.customer.customerType == "Commercial") {
                                    fullName = this.accountInqRes.accountSummaryData.primaryAccountOwner.customer.organizationName.toLowerCase();
                                }
                                var beneficiaryName = this.reqBody.beneficiaryName.toLowerCase();
                                var arrfullName = fullName.split(' ');
                                var beneficiaryNameArr = beneficiaryName.split(' ');
                                var nameCheck = true;
                                for(var i in beneficiaryNameArr) {
                                    var isWordNotExists = arrfullName.indexOf(beneficiaryNameArr[i]) == -1 ;
                                    if(isWordNotExists) {
                                        nameCheck = false;
                                        break;
                                    }
                                }
                                if (nameCheck) {
                                    this.editThirdPartyBeneficiary(this.reqBody, this.callback);

                                } else {
                                    this.callback(null, {
                                        message: "",
                                        fullName: fullName,
                                        nextStep: this.config.nextStepTo.goToCheckThirdPartyBeneficiaryName
                                    });
                                }
                            } else {
                                this.editThirdPartyBeneficiary(this.reqBody, this.callback);
                            }
                       }
                    }
                } else {
                    var error = this.errorResponse.AccountNotAllowedForTransfer;
                    this.callback(error , null);
                }
            }
        },
        editThirdPartyBeneficiary : function(reqBody , callback){
            this.callback = callback;

            this.beneficiaryName= reqBody.beneficiaryName;

            this.recipientBankAcc = reqBody.recipientBankAcc;

            this.routed = {
                institutionId           : this.config.instId,
                userId                  : reqBody.userId,
                thirdPartyBeneficiaryId           : reqBody.thirdPartyBeneficiaryId
            };

            var mongo = this.utils.initMongo(this.model ,this.routed , this.tnxId);
            var resHandle = this.thirdPartyBeneficiaryEdited.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        thirdPartyBeneficiaryEdited: function(err , result){
            if(!result){
                var error = this.errorResponse.AccountAlreadyExist;
                this.callback(error , null);
            }else{
                result.beneficiaryName= this.beneficiaryName;
                result.recipientBankAcc = this.recipientBankAcc;
                result.accountType = this.accountInqRes.accountSummaryData.accountType;
                result.customerId = this.accountInqRes.accountSummaryData.primaryAccountOwner.customer.customerId;

                result.save();
                this.callback(null , {message: this.successResponse.UpdateThirdPartyBeneficiary, nextStep:'fundsTransfer' });

            }
        },
        listThirdPartyBeneficiary: function(reqBody , callback){
            this.callback = callback;

            var routed  = {
                institutionId           : this.config.instId,
                userId                  : reqBody.userId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.thirdPartyBeneficiaryRetrieval.bind(this);
            mongo.FindMethod(resHandle);
        },
        thirdPartyBeneficiaryRetrieval: function(err , result){
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.callback(null , result);
            }
        },
        deleteThirdPartyBeneficiary: function(reqBody , callback){
            this.callback = callback;
            this.reqBody = reqBody;
            this.beneficiaryDel = 0;
           // this.checkInstruction = true;
            this.bodyLen = reqBody.beneficiaryList.length;

            var accounts = [];
            for (var i = 0; i < this.bodyLen; i++) {
                accounts.push(reqBody.beneficiaryList[i].accountNumber);

            }
            var routed = {
                institutionId           : this.config.instId,
                userId                  : reqBody.userId,
                accounts : accounts
            };


            var customer = customerMethod(this.config , this.callback , this.tnxId);
            var resHandle = this.deleteThirdPartyBeneficiaryNext.bind(this);
            //customer.transferInstructions(routed , this.callback);
            customer.transferInstructions(routed , resHandle);


            /*  var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                var resHandle = this.deleteComplete.bind(this);
                mongo.Remove(resHandle);*/
            //}
        },
        deleteThirdPartyBeneficiaryNext : function(err,result){
            if(result > 0){
                var error = this.errorResponse.thirdPartyDeletionFailed;
                error.nextStep = this.config.nextStepTo.goToConfirmDialog;
                this.callback(error,null);
                //this.callback(null , {message: this.errorResponse.thirdPartyDeletionFailed, nextStep:this.config.nextStepTo.goToConfirmDialog,transferInstructionsList:this.transferInstructionsList});
            }else{
                for (var i = 0; i < this.bodyLen; i++) {

                    var thirdPartyBeneficiaryId = this.reqBody.beneficiaryList[i].thirdPartyBeneficiaryId;
                    var routed = {
                        institutionId           : this.config.instId,
                        userId                  : this.reqBody.userId,
                        thirdPartyBeneficiaryId           : thirdPartyBeneficiaryId
                    };
                    var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                    var resHandle = this.deleteComplete.bind(this);
                    mongo.Remove(resHandle);
                }
            }
        },
        deleteThirdPartyBeneficiaryCallback:function(reqBody , callback){

            this.callback = callback;

            this.beneficiaryDel = 0;
            this.bodyLen = reqBody.beneficiaryPendingList[0].beneficiaryList.length;


            for (var i = 0; i < this.bodyLen; i++) {

                var thirdPartyBeneficiaryId = reqBody.beneficiaryPendingList[0].beneficiaryList[i].thirdPartyBeneficiaryId;
                var routed = {
                    institutionId: this.config.instId,
                    userId: reqBody.userId,
                    thirdPartyBeneficiaryId: thirdPartyBeneficiaryId
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
            }else{

                if(this.beneficiaryDel == this.bodyLen){
                    this.callback(null , {message : this.successResponse.RemoveBeneficiary,nextStep:this.config.nextStepTo.goToDeletePendingTransfer});

                }
            }
        },

        defaultMethod: function(routed , callback){
            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            mongo.FindOneMethod(callback);
        }
    };

    module.exports = function(config , tnxId){
        return (new ThirdPartyBeneficiary(config , tnxId));
    };
})();
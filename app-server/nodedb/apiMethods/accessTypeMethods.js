(function(){

    var utils = require('../lib/utils/utils');

    var errorResponse = require('../gen/errorResponse');

    var successResponse = require('../gen/successResponseMessage');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    function AccessType(config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.AccessType;
    }

    AccessType.prototype = {
        addAccessType: function(reqBody , callback){
            this.callback = callback;
            if(reqBody.userViews.UserType == "Business"){
                reqBody.userViews.PaymentsWireTransfer = {
                    RegisterBeneficiary: false,
                    ListBeneficiary: false,
                    WireTransferRequest: false,
                    WireTransferAuthorization: false,
                    WireTransferHistory: false
                }
                reqBody.userViews.Payments = {
                    FundsTransfer: false,
                    TransferMoneyAtOtherFI: false,
                    PayOtherPeople: false,
                    ThirdPartyTransfer: false,
                    PendingTransfer: false,
                    BillPay: false
                }
            } else {
                reqBody.userViews.AdministrativeToolsUserManagement = {
                    Users: false,
                    CreateNewUsers: false
                }
                reqBody.userViews.BusinessServices = {
                    BusinessFundsTransfer : false,
                    BusinessThirdPartyTransfer: false,
                    PositivePay: false,
                    BillPay: false
                }
                reqBody.userViews.BusinessServicesACH = {
                    ACHBatchSummary: false,
                    CreateNewBatch: false,
                    ACHRecipients: false,
                    ACHAddNewRecipients: false,
                    ACHBatchAuthorization: false,
                    ACHFileImport: false,
                    ACHFileImportAuthorization: false
                }
                reqBody.userViews.BusinessServicesWireTransfer = {
                    RegisterBeneficiary: false,
                    ListBeneficiary: false,
                    WireTransferRequest: false,
                    WireTransferAuthorization: false,
                    WireTransferHistory: false
                }
            }

            var routed = {
                institutionId                           : this.config.instId,
                accessType                              : reqBody.accessType,
                limitProfile                            : reqBody.limitProfile,
                privilege                               : {
                    "userViews": reqBody.userViews,
                    "access": {
                        "accountsAccess"    : [],
                        "accountsTransferAccess"    : []
                    },
                    "limits"  : {
                        "achLimits"     : {
                            "achCreditLimitPerTranc"    : '1000',
                            "achCreditLimitPerDay"      : '1000',
                            "achDebitLimitPerTranc"     : '1000',
                            "achDebitLimitPerDay"       : '1000',
                            "restrictEdit"              : false
                        },
                        "fundsLimits"   : {
                            "fundsLimitPerTranc"        : '1000',
                            "fundsLimitPerDay"          : '1000'
                        },
                        "wireLimits"    : {
                            "wireLimitPerTranc"         : '1000',
                            "wireLimitPerDay"           : '1000',
                            "restrictEdit"              : false
                        }
                    }
                }
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.accessTypeCreated.bind(this);
            mongo.Save(resHandle);
        },
        editAccessType: function(reqBody , callback){
            this.callback = callback;
            if(reqBody.userViews.UserType == "Business"){
                reqBody.userViews.PaymentsWireTransfer = {
                    RegisterBeneficiary: false,
                    ListBeneficiary: false,
                    WireTransferRequest: false,
                    WireTransferAuthorization: false,
                    WireTransferHistory: false
                }
                reqBody.userViews.Payments = {
                    FundsTransfer: false,
                    TransferMoneyAtOtherFI: false,
                    PayOtherPeople: false,
                    ThirdPartyTransfer: false,
                    PendingTransfer: false,
                    BillPay: false
                }
            } else {
                reqBody.userViews.AdministrativeToolsUserManagement = {
                    Users: false,
                    CreateNewUsers: false
                }
                reqBody.userViews.BusinessServices = {
                    BusinessFundsTransfer : false,
                    BusinessThirdPartyTransfer: false,
                    PositivePay: false,
                    BillPay: false
                }
                reqBody.userViews.BusinessServicesACH = {
                    ACHBatchSummary: false,
                    CreateNewBatch: false,
                    ACHRecipients: false,
                    ACHAddNewRecipients: false,
                    ACHBatchAuthorization: false,
                    ACHFileImport: false,
                    ACHFileImportAuthorization: false
                }
                reqBody.userViews.BusinessServicesWireTransfer = {
                    RegisterBeneficiary: false,
                    ListBeneficiary: false,
                    WireTransferRequest: false,
                    WireTransferAuthorization: false,
                    WireTransferHistory: false
                }
            }

            this.userViews = reqBody.userViews;
            this.limitProfile = reqBody.limitProfile;
            var routed = {
                institutionId                           : this.config.instId,
                accessType                              : reqBody.accessType
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.accessTypeEdited.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        accessTypeEdited:function(err , result){
            if(!result){
                var error = this.errorResponse.AccessTypeFoundFailed;
                this.callback(error , null);
            }else{
                result.limitProfile = this.limitProfile;
                result.privilege.userViews = this.userViews;
                result.save();
                this.callback(null , {message: this.successResponse.UpdateAccessType});
            }
        },
        accessTypeCreated: function(err , result){
            if(err){
                var error = this.errorResponse.AccessTypeExistsFailed;
                this.callback(error , null);
            }else{
                this.callback(null , {message : this.successResponse.CreateAccessType});
            }
        },
        listAllTypes: function(reqBody , callback){
            this.callback = callback;

            var routed = {
                institutionId                           : this.config.instId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.allAccessTypeReturn.bind(this);
            mongo.FindMethod(resHandle);
        },
        listAccessType: function(reqBody , callback){
            this.callback = callback;

            var routed = {
                institutionId       : this.config.instId,
                accessType          : reqBody.accessType
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.accessTypeReturn.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        accessTypeReturn: function(err , result){
            if(!result){
                var error = this.errorResponse.AccessTypeFoundFailed;
                this.callback(error , null);
            }else{
                this.callback(null , result);
            }
        },
        allAccessTypeReturn: function(err , result){
            if(err){
                var error = this.errorResponse.AccessTypeFoundFailed;
                this.callback(error , null);
            }else{
                this.callback(null , result);
            }
        }
    };

    module.exports = function(config , tnxId){
        return (new AccessType(config , tnxId));
    };
})();
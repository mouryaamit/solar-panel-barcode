(function(){

    var _ = require('underscore');

    var customerInquiryApi = require('../coreApi/customerInquiryApi');

    var errorResponse = require('../../gen/errorResponse');
    var utils = require('../../lib/utils/utils');
    var mongoModelName = require('../../lib/mongoQuery/mongoModelObj');
    function CustomerInq(customerObj , config , tnxId){
        this.tnxId = tnxId;
        this.bankId = config.instId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.userId = customerObj.userId;
        this.customerId = customerObj.customerId;//"1404909699768";
        this.totalSaving = 0;
        this.totalChecking = 0;
        this.totalIrs = 0;
        this.totalTimeDeposits = 0;
        this.totalLoan = 0;
        this.totalAssets = 0;
        this.totalLiability = 0;
        this.model = mongoModelName.modelName.User;
        this.utils = utils.util();
    }

    CustomerInq.prototype = {
        getExcludedAccountsForSupervisor: function(err , result){
            var excludedAccounts = null || []
            if (!result) {
                excludedAccounts = null || []
            } else {
                excludedAccounts = result.excludedAccounts;
                if (excludedAccounts == null || excludedAccounts == undefined) {
                    excludedAccounts = {}
                }
            }
            customerInquiryApi.CustomerInquiry(this.customerInquiryObj, this.resHandle, this.config, this.tnxId, excludedAccounts);
        },
        getExcludedAccounts: function(err , result){
            if(this.utils.isSubUser(result.createdBy,result.originator)){
                var routed = {
                    institutionId: this.config.instId,
                    userId: result.createdBy
                };
                var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
                var resHandle = this.getExcludedAccountsForSupervisor.bind(this);
                mongo.FindOneMethod(resHandle);
            } else {
                var excludedAccounts = null || []
                if (!result) {
                    excludedAccounts = null || []
                } else {
                    excludedAccounts = result.excludedAccounts;
                    if (excludedAccounts == null || excludedAccounts == undefined) {
                        excludedAccounts = {}
                    }
                }
                customerInquiryApi.CustomerInquiry(this.customerInquiryObj, this.resHandle, this.config, this.tnxId, excludedAccounts);
            }
        },
        directCoreCaller : function(callback){
            this.callback = callback;
            this.customerInquiryObj = {
                bankId: this.bankId,
                customerId: this.customerId,
                ignoreAccountInq:false
            };

            this.resHandle = this.directCoreResponse.bind(this);

            var routed = {
                institutionId: this.config.instId,
                userId: this.userId
            };
            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.getExcludedAccounts.bind(this);
            mongo.FindOneMethod(resHandle);

        },
        ignoreDirectCoreCaller : function(callback){
            this.callback = callback;
            this.customerInquiryObj = {
                bankId: this.bankId,
                customerId: this.customerId,
                ignoreAccountInq:true
            };

            this.resHandle = this.directCoreResponse.bind(this);

            var routed = {
                institutionId: this.config.instId,
                userId: this.userId
            };
            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.getExcludedAccounts.bind(this);
            mongo.FindOneMethod(resHandle);

        },
        directCoreResponse: function(error , success){
            if(error){
                //var errResponse = this.errorResponse[error];
                //this.callback(error , null);
                var errResponse = this.errorResponse["ZZ"];
                var errorCodeMsg = this.errorResponse[error.status.statusCode];
                errResponse.responseData.message = (!error.status.statusDescription || error.status.statusDescription == "")?errorCodeMsg.responseData.message:error.status.statusDescription;
                this.callback(errResponse , null);
            }else {
                var response = success.INSTANCE.customerData;
                response.routingNumber=success.INSTANCE.routingNumber;
                this.callback(null , response);
            }
        },
        coreCaller : function(callback){
            this.callback = callback;
            var routed = {
                userId          : this.userId
            };
            var userMethod = require('../../apiMethods/userMethods');

            var user = userMethod(this.config , this.tnxId);
            var resHandle = this.userPrivilege.bind(this);
            user.defaultMethod(routed , resHandle);
        },
        userPrivilege: function(err , result){
            if(!result){
                var error = this.errorResponse.UserNotFoundFailed;
                this.callback(error , null);
            }else{
                this.privilege = result.privilege;
                this.createdBy = result.createdBy;
                this.originator = result.originator;
                this.customerInquiryObj = {
                    bankId: this.bankId,
                    customerId: this.customerId
                };

                this.resHandle = this.processCoreResponse.bind(this);

                var routed = {
                    institutionId: this.config.instId,
                    userId: this.userId
                };
                var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
                var resHandle = this.getExcludedAccounts.bind(this);
                mongo.FindOneMethod(resHandle);

            }
        },
        processCoreResponse: function(error , success){
            if(error){
                //var errResponse = this.errorResponse[error];
                //this.callback(error , null);
                var errResponse = this.errorResponse["ZZ"];
                var errorCodeMsg = this.errorResponse[error.status.statusCode];
                errResponse.responseData.message = (!error.status.statusDescription || error.status.statusDescription == "")?errorCodeMsg.responseData.message:error.status.statusDescription;
                this.callback(errResponse , null);
            }else{
                var response = success.INSTANCE.customerData;
                var customerAccounts = response.customerAccounts;

                response.routingNumber=success.INSTANCE.routingNumber;
                response.isSubUser=this.utils.isSubUser(this.createdBy,this.originator);

                if(!this.utils.isSubUser(this.createdBy,this.originator)){
                    this.privilege.access.accountsAccess = customerAccounts;
                    this.privilege.access.accountsTransferAccess = customerAccounts;
                    this.privilege.access.accountsWireAccess = customerAccounts;
                    this.privilege.access.accountsAchAccess = customerAccounts;
                    this.privilege.access.accountsEStatementsAccess = customerAccounts;
                }
                response.customerAccounts = [];
                response.customerTransferAccounts = [];
                response.customerWireAccounts = [];
                response.customerAchAccounts = [];
                response.customerEStatementsAccounts = [];

                for(var i = 0; i < customerAccounts.length; i++) {
                    customerAccounts[i].accountString = customerAccounts[i].accountType + "-" + this.utils.maskAccount(customerAccounts[i].accountNo,this.config);

                    var currentAccObj = customerAccounts[i];
                    var foundAccessAccount = _.findWhere(this.privilege.access.accountsAccess , {accountNo : currentAccObj.accountNo});
                    var foundTransferAccount = _.findWhere(this.privilege.access.accountsTransferAccess , {accountNo : currentAccObj.accountNo});
                    var foundWireAccount = _.findWhere(this.privilege.access.accountsWireAccess , {accountNo : currentAccObj.accountNo});
                    var foundAchAccount = _.findWhere(this.privilege.access.accountsAchAccess , {accountNo : currentAccObj.accountNo});
                    var foundEStatementsAccount = _.findWhere(this.privilege.access.accountsEStatementsAccess , {accountNo : currentAccObj.accountNo});

                    if(foundAccessAccount) {
                        var totalSaving = this.totalSavingCal(currentAccObj);
                        this.totalSaving = this.totalSaving + totalSaving;

                        var totalChecking = this.totalCheckingCal(currentAccObj);
                        this.totalChecking = this.totalChecking + totalChecking;

                        var totalIrs = this.totalIRSCal(currentAccObj);
                        this.totalIrs = this.totalIrs + totalIrs;

                        var totalCD = this.totalCDCal(currentAccObj);
                        this.totalTimeDeposits = this.totalTimeDeposits + totalCD;

                        var totalLoan = this.totalLoanCal(currentAccObj);
                        this.totalLoan = this.totalLoan + totalLoan;


                        var assetsInfo = this.totalAssetCal(currentAccObj);
                        this.totalAssets = this.totalAssets + assetsInfo;

                        var liable = this.liabilityCal(currentAccObj);
                        this.totalLiability = this.totalLiability + liable;

                        response.customerAccounts.push(currentAccObj);
                    }

                    if(foundTransferAccount){
                        response.customerTransferAccounts.push(currentAccObj);
                    }
                    if(foundWireAccount){
                        response.customerWireAccounts.push(currentAccObj);
                    }
                    if(foundAchAccount){
                        response.customerAchAccounts.push(currentAccObj);
                    }
                    if(foundEStatementsAccount){
                        response.customerEStatementsAccounts.push(currentAccObj);
                    }
                }
                if(this.config.sortAccountsBy == "accountNo") {
                    response.customerAccounts = _.sortBy(response.customerAccounts, function (account) {
                        return account.accountNo;
                    });
                    response.customerTransferAccounts = _.sortBy(response.customerTransferAccounts, function (account) {
                        return account.accountNo;
                    });
                    response.customerWireAccounts = _.sortBy(response.customerWireAccounts, function (account) {
                        return account.accountNo;
                    });
                    response.customerAchAccounts = _.sortBy(response.customerAchAccounts, function (account) {
                        return account.accountNo;
                    });
                    response.customerEStatementsAccounts = _.sortBy(response.customerEStatementsAccounts, function (account) {
                        return account.accountNo;
                    });
                }
                if(this.config.sortAccountsBy == "accountType") {
                    response.customerAccounts = _.sortBy(response.customerAccounts, function (account) {
                        return account.accountType;
                    });
                    response.customerTransferAccounts = _.sortBy(response.customerTransferAccounts, function (account) {
                        return account.accountType;
                    });
                    response.customerWireAccounts = _.sortBy(response.customerWireAccounts, function (account) {
                        return account.accountType;
                    });
                    response.customerAchAccounts = _.sortBy(response.customerAchAccounts, function (account) {
                        return account.accountType;
                    });
                    response.customerEStatementsAccounts = _.sortBy(response.customerEStatementsAccounts, function (account) {
                        return account.accountType;
                    });
                }
                if(this.config.sortAccountsBy == "accountTypeAndAccountNo") {
                    response.customerAccounts = _.sortBy(response.customerAccounts, function (account) {
                        return account.accountString;
                    });
                    response.customerTransferAccounts = _.sortBy(response.customerTransferAccounts, function (account) {
                        return account.accountString;
                    });
                    response.customerWireAccounts = _.sortBy(response.customerWireAccounts, function (account) {
                        return account.accountString;
                    });
                    response.customerAchAccounts = _.sortBy(response.customerAchAccounts, function (account) {
                        return account.accountString;
                    });
                    response.customerEStatementsAccounts = _.sortBy(response.customerEStatementsAccounts, function (account) {
                        return account.accountString;
                    });
                }
                response.totalAssets = (this.totalAssets).toFixed(2);
                response.totalLiability = (this.totalLiability).toFixed(2);
                response.totalSaving = (this.totalSaving).toFixed(2);
                response.totalChecking = (this.totalChecking).toFixed(2);
                response.totalIrs = (this.totalIrs).toFixed(2);
                response.totalTimeDeposits = (this.totalTimeDeposits).toFixed(2);
                response.totalLoan = (this.totalLoan).toFixed(2);
                this.response = response;
                this.findUserNickName();
//                this.callback(null , response);
            }
        },
        findUserNickName: function(){
            var routed = {
                institutionId                       : this.config.instId,
                userId                              : this.userId
            };
            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.addNickName.bind(this);
            mongo.FindOneMethod(resHandle);
//            this.callback(null , this.response);
        },
        addNickName:function(err,result){
            for(var i=0;i<this.response.customerAccounts.length;i++){
                for(var j=0;j<result.accountsInformation.length;j++){
                    if(this.response.customerAccounts[i].accountNo == result.accountsInformation[j].accountNo){
                        this.response.customerAccounts[i].nickName = result.accountsInformation[j].nickName;
                    }
                }
            }
            if(this.utils.isSubUser(result.createdBy,result.originator)){
                this.response.emailAddress = result.emailId;
                this.response.cellPhoneNumberData.phoneNumber = result.contact.mobileNo;
            }
            this.callback(null , this.response);
        },
        debitOrCreditValidate: function(balance){
            if(balance.debitOrCredit == 1){
                return balance.amount;
            }else{
                return '-'+balance.amount;
            }
        },
        debitOrCreditLoanValidate: function(balance){
            if(balance.debitOrCredit == 0){
                return balance.amount;
            }else{
                return '-'+balance.amount;
            }
        },
        totalSavingCal: function(accObj){
            var accountType = accObj.accountType;
            var getAmount = this.debitOrCreditValidate.bind(this);
            if(accountType == 'SAVINGS'){
                return parseFloat(getAmount(accObj.availableBalance));
            }else{
                return 0;
            }
        },
        totalCheckingCal: function(accObj){
            var accountType = accObj.accountType;
            var getAmount = this.debitOrCreditValidate.bind(this);
            if(accountType == 'CHECKING'){
                return parseFloat(getAmount(accObj.availableBalance));
            }else{
                return 0;
            }
        },
        totalCDCal: function(accObj){
            var accountType = accObj.accountType;
            var getAmount = this.debitOrCreditValidate.bind(this);
            if(accountType == 'CD'){
                return parseFloat(getAmount(accObj.availableBalance));
            }else{
                return 0;
            }
        },
        totalIRSCal: function(accObj){
            var accountType = accObj.accountType;
            var getAmount = this.debitOrCreditValidate.bind(this);
            if(accountType == 'CD' && accObj.irsPlanNumber != ''){
                return parseFloat(getAmount(accObj.availableBalance));
            }else{
                return 0;
            }
        },
        totalLoanCal: function(accObj){
            var accountType = accObj.accountType;
            var getAmount = this.debitOrCreditLoanValidate.bind(this);
            var loanTypes = ['REAL_ESTATE_LOAN' , 'INSTALLMENT_LOAN' , 'COMMERCIAL_LOAN' , 'CONSTRUCTION_LOAN' , 'RULE_OF_78' , 'USER_DEFINED_LOAN'];
            var found = _.contains(loanTypes , accountType);
            if(found){
                return parseFloat(getAmount(accObj.principleBalance));
            }else{
                return 0;
            }
        },
        totalAssetCal: function(accObj){
            var accountType = accObj.accountType;
            var getAmount = this.debitOrCreditValidate.bind(this);
            var accountTypes = ['SAVINGS' , 'CHECKING' , 'CD'];
            var found = _.contains(accountTypes , accountType);
            var assets = parseFloat(getAmount(accObj.availableBalance));
            //if(found && assets > 0){
            if(found){
                return assets;
            }else{
                return 0;
            }
        },
        liabilityCal : function(accObj){
            var accountType = accObj.accountType;
            var getAmount = this.debitOrCreditLoanValidate.bind(this);
            var accountTypes = ['REAL_ESTATE_LOAN' , 'INSTALLMENT_LOAN' , 'COMMERCIAL_LOAN' , 'CONSTRUCTION_LOAN' , 'RULE_OF_78' , 'USER_DEFINED_LOAN'];
            var found = _.contains(accountTypes , accountType);
            //var liable = parseFloat(accObj.availableBalance.amount);

            //if(found && liable < 0){
            if(found){
                //return Math.abs(liable);
                if(accObj.principleBalance.amount == "0.00")  return parseFloat(accObj.principleBalance.amount);
                return parseFloat(getAmount(accObj.principleBalance));
            }else{
                return 0;
            }
        }
    };

    module.exports.CustomerInquiry = function(customerObj , config , tnxId){
        return (new CustomerInq(customerObj , config , tnxId));
    };
})();

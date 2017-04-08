(function(){

    var accountInquiryApi = require('../coreApi/accountInquiryApi');

    //var coreErrorResponse = require('../../gen/coreResponseTemplate');

    var errorResponse = require('../../gen/errorResponse');

    function AccountInq(accountData , config , tnxId){
        this.tnxId = tnxId;
        this.bankId = config.instId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.accountNo = accountData.accountNo;//"010306743249";
        this.accountCategory = accountData.accountCategory;//"DEPOSIT";
        // this.errorResponse = errorResponse.ErrorMessage();
    }

    AccountInq.prototype = {
        coreCaller : function(callback){
            this.callback = callback;
            var accountInquiryObj = {
                bankId                      : this.bankId,
                accountNo                   : this.accountNo,
                accountCategory             : this.accountCategory
            };

            var resHandle = this.processCoreResponse.bind(this);
            accountInquiryApi.AccountInquiry(accountInquiryObj , resHandle , this.config , this.tnxId);
        },
        processCoreResponse: function(error , response){
            if(error){
                var errResponse = this.errorResponse["ZZ"];
                var errorCodeMsg = this.errorResponse[error.status.statusCode];
                errResponse.responseData.message = (!error.status.statusDescription || error.status.statusDescription == "")?errorCodeMsg.responseData.message:error.status.statusDescription;
                this.callback(errResponse , null);
            }else{
                this.callback(null , response.INSTANCE);
            }
        }
    };

    module.exports.AccountInquiry = function(accountData , config , tnxId){
        return (new AccountInq(accountData , config , tnxId));
    };
})();

(function(){

    var bankPasswordRuleMethod = require('../../supportMethods/bankPasswordRuleMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var bankPasswordRuleApi = function bankPasswordRuleApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    bankPasswordRuleApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankPassword = bankPasswordRuleMethod(this.response.config , this.tnxId);
        bankPassword.addBankPasswordRule(this.body , resHandle);
    };

    module.exports.bankPasswordRuleApi = function(rin , callback){
        var dApi = new bankPasswordRuleApi(rin , callback);
        dApi.requestApi();
    };
})();
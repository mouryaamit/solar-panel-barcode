(function(){

    var bankPasswordRuleMethod = require('../../supportMethods/bankPasswordRuleMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var showPasswordRuleApi = function showPasswordRuleApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    showPasswordRuleApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankPassword = bankPasswordRuleMethod(this.response.config , this.tnxId);
        bankPassword.getCurrentBankPasswordRule(this.body , resHandle);
    };

    module.exports.showPasswordRuleApi = function(rin , callback){
        var dApi = new showPasswordRuleApi(rin , callback);
        dApi.requestApi();
    };
})();
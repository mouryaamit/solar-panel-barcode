(function(){

    var bankPasswordRuleMethod = require('../../supportMethods/bankPasswordRuleMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var changeBankPasswordRuleApi = function changeBankPasswordRuleApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    changeBankPasswordRuleApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankPassword = bankPasswordRuleMethod(this.response.config , this.tnxId);
        bankPassword.changeBankPasswordRule(this.body , resHandle);
    };

    module.exports.changeBankPasswordRuleApi = function(rin , callback){
        var dApi = new changeBankPasswordRuleApi(rin , callback);
        dApi.requestApi();
    };
})();
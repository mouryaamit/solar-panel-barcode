(function(){

    var bankPolicyMethod = require('../../supportMethods/bankPolicyMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var bankPolicyApi = function bankPolicyApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    bankPolicyApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankPolicy = bankPolicyMethod(this.response.config , this.tnxId);
        bankPolicy.addBankPolicy(this.body , resHandle);
    };

    module.exports.bankPolicyApi = function(rin , callback){
        var dApi = new bankPolicyApi(rin , callback);
        dApi.requestApi();
    };
})();
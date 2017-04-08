(function(){

    var bankPolicyMethod = require('../../supportMethods/bankPolicyMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var changeBankPolicyApi = function changeBankPolicyApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    changeBankPolicyApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankPolicy = bankPolicyMethod(this.response.config , this.tnxId);
        bankPolicy.changeBankPolicy(this.body , resHandle);
    };

    module.exports.changeBankPolicyApi = function(rin , callback){
        var dApi = new changeBankPolicyApi(rin , callback);
        dApi.requestApi();
    };
})();
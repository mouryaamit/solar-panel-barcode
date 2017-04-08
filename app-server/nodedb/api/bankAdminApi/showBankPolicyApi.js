(function(){

    var userMethod = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var showBankPolicyApi = function showBankPolicyApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    showBankPolicyApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethod(this.response.config , this.tnxId);
        user.getCurrentBankPolicy(this.body , resHandle);
    };

    module.exports.showBankPolicyApi = function(rin , callback){
        var dApi = new showBankPolicyApi(rin , callback);
        dApi.requestApi();
    };
})();
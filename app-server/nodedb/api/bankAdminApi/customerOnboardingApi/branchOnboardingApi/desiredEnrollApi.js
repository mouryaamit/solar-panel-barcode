(function(){

    var customerOnboardingMethod = require('../../../../apiMethods/customerOnboardingMethods');

    var responseMethod = require('../../../../apiMethods/responseHandleMethods');

    var desiredEnrollApi = function desiredEnrollApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    desiredEnrollApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var customerOnboarding = customerOnboardingMethod(this.response.config , this.tnxId);
        customerOnboarding.desiredEnrollDo(this.response.request.body , resHandle);
    };

    module.exports.desiredEnrollApi = function(rin , callback){
        var dApi = new desiredEnrollApi(rin , callback);
        dApi.requestApi();
    };
})();
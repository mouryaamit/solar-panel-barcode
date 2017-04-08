(function(){

    var customerOnboardingMethod = require('../../../../apiMethods/customerOnboardingMethods');

    var responseMethod = require('../../../../apiMethods/responseHandleMethods');

    var enrollAndPrintApi = function enrollAndPrintApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    enrollAndPrintApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var customerOnboarding = customerOnboardingMethod(this.response.config , this.tnxId);
        customerOnboarding.enrollAndPrintDo(this.response.request.body , resHandle);
    };

    module.exports.enrollAndPrintApi = function(rin , callback){
        var dApi = new enrollAndPrintApi(rin , callback);
        dApi.requestApi();
    };
})();
(function(){

    var customerOnboardingMethod = require('../../../../apiMethods/customerOnboardingMethods');

    var responseMethod = require('../../../../apiMethods/responseHandleMethods');

    var enrollAndMailApi = function enrollAndMailApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    enrollAndMailApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var customerOnboarding = customerOnboardingMethod(this.response.config , this.tnxId);
        customerOnboarding.enrollAndMailDo(this.response.request.body , resHandle);
    };

    module.exports.enrollAndMailApi = function(rin , callback){
        var dApi = new enrollAndMailApi(rin , callback);
        dApi.requestApi();
    };
})();
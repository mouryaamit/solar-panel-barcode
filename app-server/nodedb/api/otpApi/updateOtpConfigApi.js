(function(){

    var otpConfigMethod = require('../../apiMethods/otpConfigurationMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var updateOtpConfigApi = function updateOtpConfigApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    updateOtpConfigApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var otp = otpConfigMethod(this.response.config , this.tnxId);
        otp.editOtpConfig(this.body  , resHandle);
    };

    module.exports.updateOtpConfigApi = function(rin , callback){

        var dApi = new updateOtpConfigApi(rin , callback);
        dApi.requestApi();
    };
})();
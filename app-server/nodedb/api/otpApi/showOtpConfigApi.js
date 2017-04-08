(function(){

    var otpConfigMethod = require('../../apiMethods/otpConfigurationMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var showOtpConfigApi = function showOtpConfigApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    showOtpConfigApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var otp = otpConfigMethod(this.response.config , this.tnxId);
        otp.showOtpConfig(this.body  , resHandle);
    };

    module.exports.showOtpConfigApi = function(rin , callback){

        var dApi = new showOtpConfigApi(rin , callback);
        dApi.requestApi();
    };
})();
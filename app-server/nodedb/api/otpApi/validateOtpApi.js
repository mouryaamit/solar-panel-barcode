(function(){

    var otpMethod = require('../../apiMethods/otpMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var validateOtpApi = function validateOtpApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.body['sessionId'] = rin.sessionId;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    validateOtpApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var otp = otpMethod(this.response.config , this.tnxId);
        otp.validateOtp(this.body  , resHandle);
    };

    module.exports.validateOtpApi = function(rin , callback){

        var dApi = new validateOtpApi(rin , callback);
        dApi.requestApi();
    };
})();
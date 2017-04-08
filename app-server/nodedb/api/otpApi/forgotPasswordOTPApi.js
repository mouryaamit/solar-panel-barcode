(function(){

    var userMethod = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var forgotPasswordOtpApi = function forgotPasswordOtpApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    forgotPasswordOtpApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethod(this.response.config , this.tnxId);
        user.verifyFPOTP(this.body  , resHandle);
    };

    module.exports.forgotPasswordOtpApi = function(rin , callback){

        var dApi = new forgotPasswordOtpApi(rin , callback);
        dApi.requestApi();
    };
})();
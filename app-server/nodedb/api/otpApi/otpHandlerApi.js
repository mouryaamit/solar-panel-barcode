(function(){

    var otpMethod = require('../../apiMethods/otpMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var otpHandlerApi = function otpHandlerApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    otpHandlerApi.prototype.requestApi = function(){
    	
        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var otp = otpMethod(this.response.config , this.tnxId);
        otp.createOTP(this.body  , resHandle);
    };

    module.exports.otpHandlerApi = function(rin , callback){

        var dApi = new otpHandlerApi(rin , callback);
        dApi.requestApi();
    };
})();
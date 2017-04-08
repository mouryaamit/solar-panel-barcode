(function(){

    var userMethod = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var resetPasswordApi = function resetPasswordApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    resetPasswordApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethod(this.response.config , this.tnxId);
        user.resetPassword(this.body , resHandle);
    };

    module.exports.resetPasswordApi = function(rin , callback){
        var dApi = new resetPasswordApi(rin , callback);
        dApi.requestApi();
    };
})();
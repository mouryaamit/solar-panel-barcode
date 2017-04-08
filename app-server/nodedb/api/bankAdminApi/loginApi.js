(function(){

    var bankAdminMethod = require('../../apiMethods/bankAdminMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var loginApi = function loginApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    loginApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankAdmin = bankAdminMethod(this.response.config , this.tnxId);
        bankAdmin.validateLogin(this.response , resHandle);
    };

    module.exports.loginApi = function(rin , callback){
        var dApi = new loginApi(rin , callback);
        dApi.requestApi();
    };
})();
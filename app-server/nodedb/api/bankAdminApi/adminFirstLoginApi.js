(function(){

    var bankAdminMethod = require('../../apiMethods/bankAdminMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var adminFirstLoginApi = function adminFirstLoginApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    adminFirstLoginApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var admin = bankAdminMethod(this.response.config , this.tnxId);
        admin.firstTimeLoginChange(this.response.request.body , resHandle);
    };

    module.exports.adminFirstLoginApi = function(rin , callback){
        var dApi = new adminFirstLoginApi(rin , callback);
        dApi.requestApi();
    };
})();
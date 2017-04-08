(function(){

    var bankAdminMethod = require('../../apiMethods/bankAdminMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var resetPasswordAdminApi = function resetPasswordAdminApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    resetPasswordAdminApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankAdmin = bankAdminMethod(this.response.config , this.tnxId);
        bankAdmin.resetPasswordAdmin(this.response.request.body , resHandle);
    };

    module.exports.resetPasswordAdminApi = function(rin , callback){
        var dApi = new resetPasswordAdminApi(rin , callback);
        dApi.requestApi();
    };
})();
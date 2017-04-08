(function(){

    var bankAdminMethod = require('../../apiMethods/bankAdminMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var changeStatusBankAdminApi = function changeStatusBankAdminApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    changeStatusBankAdminApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankAdmin = bankAdminMethod(this.response.config , this.tnxId);
        bankAdmin.changeStatusBankAdmin(this.response.request.body , resHandle);
    };

    module.exports.changeStatusBankAdminApi = function(rin , callback){
        var dApi = new changeStatusBankAdminApi(rin , callback);
        dApi.requestApi();
    };
})();
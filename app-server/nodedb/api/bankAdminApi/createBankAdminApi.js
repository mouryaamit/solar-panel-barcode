(function(){

    var bankAdminMethod = require('../../apiMethods/bankAdminMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var createAdminApi = function createAdminApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    createAdminApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankAdmin = bankAdminMethod(this.response.config , this.tnxId);
        bankAdmin.createAdmin(this.response.request.body , resHandle);
    };

    module.exports.createAdminApi = function(rin , callback){
        var dApi = new createAdminApi(rin , callback);
        dApi.requestApi();
    };
})();
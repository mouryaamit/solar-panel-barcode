(function(){

    var bankAdminMethod = require('../../apiMethods/bankAdminMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var listAdminAllSQApi = function listAdminAllSQApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    listAdminAllSQApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var admin = bankAdminMethod(this.response.config , this.tnxId);
        admin.getAllAdminSQ(this.response.request.body , resHandle);
    };

    module.exports.listAdminAllSQApi = function(rin , callback){
        var dApi = new listAdminAllSQApi(rin , callback);
        dApi.requestApi();
    };
})();
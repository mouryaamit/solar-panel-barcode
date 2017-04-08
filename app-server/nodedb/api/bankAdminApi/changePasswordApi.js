(function(){

    var bankAdminMethod = require('../../apiMethods/bankAdminMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var changeAdminPasswordApi = function changeAdminPasswordApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    changeAdminPasswordApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankAdmin = bankAdminMethod(this.response.config , this.tnxId);
        bankAdmin.changeAdminPassword(this.response.request.body , resHandle);
    };

    module.exports.changeAdminPasswordApi = function(rin , callback){
        var dApi = new changeAdminPasswordApi(rin , callback);
        dApi.requestApi();
    };
})();
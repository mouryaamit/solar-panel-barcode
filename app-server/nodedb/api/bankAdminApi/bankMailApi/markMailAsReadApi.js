(function(){

    var bankMailMethod = require('../../../apiMethods/bankMailMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var adminMailAsReadApi = function adminMailAsReadApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    adminMailAsReadApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankMail = bankMailMethod(this.response.config , this.tnxId);
        bankMail.markIsAdminRead(this.response.request.body , resHandle);
    };

    module.exports.adminMailAsReadApi = function(rin , callback){
        var dApi = new adminMailAsReadApi(rin , callback);
        dApi.requestApi();
    };
})();
(function(){

    var bankMailMethod = require('../../../apiMethods/bankMailMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var adminMailToTrashApi = function adminMailToTrashApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    adminMailToTrashApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankMail = bankMailMethod(this.response.config , this.tnxId);
        bankMail.adminMessageToTrash(this.response.request.body , resHandle);
    };

    module.exports.adminMailToTrashApi = function(rin , callback){
        var dApi = new adminMailToTrashApi(rin , callback);
        dApi.requestApi();
    };
})();
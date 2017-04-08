(function(){

    var bankMailMethod = require('../../../apiMethods/bankMailMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var adminMailInboxApi = function adminMailInboxApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    adminMailInboxApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankMail = bankMailMethod(this.response.config , this.tnxId);
        bankMail.showAdminInbox(this.response.request.body , resHandle);
    };

    module.exports.adminMailInboxApi = function(rin , callback){
        var dApi = new adminMailInboxApi(rin , callback);
        dApi.requestApi();
    };
})();
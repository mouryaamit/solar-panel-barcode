(function(){

    var bankMailMethod = require('../../../apiMethods/bankMailMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var adminMailSentApi = function adminMailSentApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    adminMailSentApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankMail = bankMailMethod(this.response.config , this.tnxId);
        bankMail.showAdminSentBox(this.response.request.body , resHandle);
    };

    module.exports.adminMailSentApi = function(rin , callback){
        var dApi = new adminMailSentApi(rin , callback);
        dApi.requestApi();
    };
})();
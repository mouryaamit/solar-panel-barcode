(function(){

    var bankMailMethod = require('../../../apiMethods/bankMailMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var mailToAdminApi = function mailToAdminApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    mailToAdminApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankMail = bankMailMethod(this.response.config , this.tnxId);
        bankMail.sendEmailFromUser(this.response.request.body , resHandle);
    };

    module.exports.mailToAdminApi = function(rin , callback){
        var dApi = new mailToAdminApi(rin , callback);
        dApi.requestApi();
    };
})();
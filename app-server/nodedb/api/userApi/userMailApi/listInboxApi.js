(function(){

    var bankMailMethod = require('../../../apiMethods/bankMailMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var userMailInboxApi = function userMailInboxApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    userMailInboxApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankMail = bankMailMethod(this.response.config , this.tnxId);
        bankMail.showUserInbox(this.response.request.body , resHandle);
    };

    module.exports.userMailInboxApi = function(rin , callback){
        var dApi = new userMailInboxApi(rin , callback);
        dApi.requestApi();
    };
})();
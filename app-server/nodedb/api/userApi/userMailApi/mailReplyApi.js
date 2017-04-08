(function(){

    var bankMailMethod = require('../../../apiMethods/bankMailMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var userMailReplyApi = function userMailReplyApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    userMailReplyApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankMail = bankMailMethod(this.response.config , this.tnxId);
        bankMail.replyByUser(this.response.request.body , resHandle);
    };

    module.exports.userMailReplyApi = function(rin , callback){
        var dApi = new userMailReplyApi(rin , callback);
        dApi.requestApi();
    };
})();
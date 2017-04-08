(function(){

    var bankMailMethod = require('../../../apiMethods/bankMailMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var userMailToTrashApi = function userMailToTrashApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    userMailToTrashApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankMail = bankMailMethod(this.response.config , this.tnxId);
        bankMail.userMessageToTrash(this.response.request.body , resHandle);
    };

    module.exports.userMailToTrashApi = function(rin , callback){
        var dApi = new userMailToTrashApi(rin , callback);
        dApi.requestApi();
    };
})();
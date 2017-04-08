(function(){

    var bankMailMethod = require('../../../apiMethods/bankMailMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var userMailAsReadApi = function userMailAsReadApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    userMailAsReadApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var bankMail = bankMailMethod(this.response.config , this.tnxId);
        bankMail.markIsUserRead(this.response.request.body , resHandle);
    };

    module.exports.userMailAsReadApi = function(rin , callback){
        var dApi = new userMailAsReadApi(rin , callback);
        dApi.requestApi();
    };
})();
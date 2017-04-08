(function(){

    var bankAdminMethod = require('../../apiMethods/bankAdminMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var verifyMFAadminSQApi = function verifyMFAadminSQApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    verifyMFAadminSQApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var admin = bankAdminMethod(this.response.config , this.tnxId);
        admin.verifyMFAQuestion(this.response.request.body , resHandle);
    };

    module.exports.verifyMFAadminSQApi = function(rin , callback){
        var dApi = new verifyMFAadminSQApi(rin , callback);
        dApi.requestApi();
    };
})();
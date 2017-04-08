(function(){

    var bankAdminMethod = require('../../apiMethods/bankAdminMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var mfaAdminSQApi = function mfaAdminSQApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    mfaAdminSQApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var admin = bankAdminMethod(this.response.config , this.tnxId);
        admin.securityQuestionMFA(this.response.request.body , resHandle);
    };

    module.exports.mfaAdminSQApi = function(rin , callback){
        var dApi = new mfaAdminSQApi(rin , callback);
        dApi.requestApi();
    };
})();
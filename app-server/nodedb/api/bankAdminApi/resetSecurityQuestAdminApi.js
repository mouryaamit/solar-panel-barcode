(function(){

    var bankAdminMethod = require('../../apiMethods/bankAdminMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var resetSecurityQuestAdminApi = function resetSecurityQuestAdminApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    resetSecurityQuestAdminApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var admin = bankAdminMethod(this.response.config , this.tnxId);
        admin.resetSecurityQuest(this.response.request.body , resHandle);
    };

    module.exports.resetSecurityQuestAdminApi = function(rin , callback){
        var dApi = new resetSecurityQuestAdminApi(rin , callback);
        dApi.requestApi();
    };
})();
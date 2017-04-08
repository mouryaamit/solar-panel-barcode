(function(){

    var bankAdminMethod = require('../../apiMethods/bankAdminMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var addAdminNewQuestionsAtLoginApi = function addAdminNewQuestionsAtLoginApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    addAdminNewQuestionsAtLoginApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var admin = bankAdminMethod(this.response.config , this.tnxId);
        admin.changeAdminSecurityQuestion(this.response.request.body , resHandle);
    };

    module.exports.addAdminNewQuestionsAtLoginApi = function(rin , callback){
        var dApi = new addAdminNewQuestionsAtLoginApi(rin , callback);
        dApi.requestApi();
    };
})();
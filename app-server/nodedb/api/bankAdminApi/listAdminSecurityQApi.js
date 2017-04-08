(function(){

    var bankAdminMethod = require('../../apiMethods/bankAdminMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var listAdminSecurityQApi = function listAdminSecurityQApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    listAdminSecurityQApi.prototype.requestApi = function(){
        this.response.body = {status: 200 , responseData:{secretQuestions :this.response.config.secretQuestions[this.response.config.setLang]}};
        this.response.status = 200;
        this.callback(null, this.response);
    };

    module.exports.listAdminSecurityQApi = function(rin , callback){
        var dApi = new listAdminSecurityQApi(rin , callback);
        dApi.requestApi();
    };
})();
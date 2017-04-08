(function(){

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var listSecurityQApi = function listSecurityQApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    listSecurityQApi.prototype.requestApi = function(){

        /*var response = responseMethod(this.response , this.callback , this.tnxId);
         var resHandle = response.requestHandle.bind(this);
         var user = userMethods(this.response.config , this.tnxId);
         user.firstTimeLoginChange(this.response.request.body , resHandle);*/
        this.response.body = {status: 200 , responseData:{secretQuestions :this.response.config.secretQuestions[this.response.config.setLang]}};
        this.response.status = 200;
        this.callback(null, this.response);
    };

    module.exports.listSecurityQApi = function(rin , callback){
        var dApi = new listSecurityQApi(rin , callback);
        dApi.requestApi();
    };
})();
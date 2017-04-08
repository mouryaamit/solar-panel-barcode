(function(){

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var addNewQuestionsAtLoginApi = function addNewQuestionsAtLoginApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    addNewQuestionsAtLoginApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.changeSecurityQuestion(this.response.request.body , resHandle);
    };

    module.exports.addNewQuestionsAtLoginApi = function(rin , callback){
        var dApi = new addNewQuestionsAtLoginApi(rin , callback);
        dApi.requestApi();
    };
})();
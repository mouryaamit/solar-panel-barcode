(function(){

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var verifyMFASQApi = function verifyMFASQApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    verifyMFASQApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.verifyMFAQuestion(this.response.request.body , resHandle);
    };

    module.exports.verifyMFASQApi = function(rin , callback){
        var dApi = new verifyMFASQApi(rin , callback);
        dApi.requestApi();
    };
})();
(function(){

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var verifyUserSQApi = function verifyUserSQApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    verifyUserSQApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.verifyUserSQ(this.response.request.body , resHandle);
    };

    module.exports.verifyUserSQApi = function(rin , callback){
        var dApi = new verifyUserSQApi(rin , callback);
        dApi.requestApi();
    };
})();
(function(){

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var userAllSQApi = function userAllSQApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    userAllSQApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.getAllUserSQ(this.response.request.body , resHandle);
    };

    module.exports.userAllSQApi = function(rin , callback){
        var dApi = new userAllSQApi(rin , callback);
        dApi.requestApi();
    };
})();
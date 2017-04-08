(function(){

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var reactivateUserApi = function reactivateUserApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    reactivateUserApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.reactivateUser(this.response.request.body , resHandle);
    };

    module.exports.reactivateUserApi = function(rin , callback){
        var dApi = new reactivateUserApi(rin , callback);
        dApi.requestApi();
    };
})();
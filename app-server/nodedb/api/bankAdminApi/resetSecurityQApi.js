(function(){

    var userMethod = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var resetSecurityQApi = function resetSecurityQApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    resetSecurityQApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethod(this.response.config , this.tnxId);
        user.resetSecurityQ(this.body , resHandle);
    };

    module.exports.resetSecurityQApi = function(rin , callback){
        var dApi = new resetSecurityQApi(rin , callback);
        dApi.requestApi();
    };
})();
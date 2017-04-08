(function(){

    var userMethod = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var unLockedUserApi = function unLockedUserApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    unLockedUserApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethod(this.response.config , this.tnxId);
        user.unLockUser(this.response.request.body , resHandle);
    };

    module.exports.unLockedUserApi = function(rin , callback){
        var dApi = new unLockedUserApi(rin , callback);
        dApi.requestApi();
    };
})();
(function(){

    var lockUserMethod = require('../../apiMethods/lockUserMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var listLockedUserApi = function listLockedUserApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    listLockedUserApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var lock = lockUserMethod(this.response.config , this.tnxId);
        lock.listLockedUser(resHandle);
    };

    module.exports.listLockedUserApi = function(rin , callback){
        var dApi = new listLockedUserApi(rin , callback);
        dApi.requestApi();
    };
})();
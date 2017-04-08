(function(){

    var userMethod = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var activeUsersApi = function activeUsersApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    activeUsersApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethod(this.response.config , this.tnxId);
        user.activeUsers(this.response.request.body , resHandle);
    };

    module.exports.activeUsersApi = function(rin , callback){
        var dApi = new activeUsersApi(rin , callback);
        dApi.requestApi();
    };
})();
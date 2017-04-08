(function(){

    var userMethod = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var inActiveUserApi = function inActiveUserApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    inActiveUserApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethod(this.response.config , this.tnxId);
        user.inActiveUsers(this.response.request.body , resHandle);
    };

    module.exports.inActiveUserApi = function(rin , callback){
        var dApi = new inActiveUserApi(rin , callback);
        dApi.requestApi();
    };
})();
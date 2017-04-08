(function(){

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var userLimitsApi = function userLimitsApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    userLimitsApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.getUserLimits(this.response.request.body , resHandle);
    };

    module.exports.userLimitsApi = function(rin , callback){
        var dApi = new userLimitsApi(rin , callback);
        dApi.requestApi();
    };
})();
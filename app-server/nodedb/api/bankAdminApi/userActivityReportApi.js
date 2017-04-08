(function(){

    var userActivityMethod = require('../../apiMethods/userActivityMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var userActivityApi = function userActivityApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    userActivityApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userActivityMethod(this.response.config , this.tnxId);
        user.getUserActivityReport(this.response.request.body , resHandle);
    };

    module.exports.userActivityApi = function(rin , callback){
        var dApi = new userActivityApi(rin , callback);
        dApi.requestApi();
    };
})();
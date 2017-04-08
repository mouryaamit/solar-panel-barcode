(function(){

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var updateUserApi = function updateUserApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    updateUserApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.updateUserBySupervisor(this.response.request.body , resHandle);
    };

    module.exports.updateUserApi = function(rin , callback){

        var dApi = new updateUserApi(rin , callback);
        dApi.requestApi();
    };
})();
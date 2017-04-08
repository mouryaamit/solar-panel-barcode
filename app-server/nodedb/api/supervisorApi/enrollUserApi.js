(function(){

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var enrollUserApi = function enrollUserApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    enrollUserApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.addUserBySupervisor(this.response.request.body , resHandle);
    };

    module.exports.enrollUserApi = function(rin , callback){

        var dApi = new enrollUserApi(rin , callback);
        dApi.requestApi();
    };
})();
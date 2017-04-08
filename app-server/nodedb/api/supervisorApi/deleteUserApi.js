(function(){

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var deleteUserApi = function deleteUserApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    deleteUserApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.userDeleteBySupervisor(this.response.request.body , resHandle);
    };

    module.exports.deleteUserApi = function(rin , callback){

        var dApi = new deleteUserApi(rin , callback);
        dApi.requestApi();
    };
})();
(function(){

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var changeUSQApi = function changeUSQApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    changeUSQApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.userSQChangeBySupervisor(this.response.request.body , resHandle);
    };

    module.exports.changeUSQApi = function(rin , callback){

        var dApi = new changeUSQApi(rin , callback);
        dApi.requestApi();
    };
})();
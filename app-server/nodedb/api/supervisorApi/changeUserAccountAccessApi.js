(function(){

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var changeUAApi = function changeUAApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    changeUAApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.changeAccountAccess(this.response.request.body , resHandle);
    };

    module.exports.changeUAApi = function(rin , callback){

        var dApi = new changeUAApi(rin , callback);
        dApi.requestApi();
    };
})();
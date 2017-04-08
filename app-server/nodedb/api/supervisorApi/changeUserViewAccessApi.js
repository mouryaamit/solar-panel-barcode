(function(){

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var changeUVAApi = function changeUVAApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    changeUVAApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.changePrivileges(this.response.request.body , resHandle);
    };

    module.exports.changeUVAApi = function(rin , callback){

        var dApi = new changeUVAApi(rin , callback);
        dApi.requestApi();
    };
})();
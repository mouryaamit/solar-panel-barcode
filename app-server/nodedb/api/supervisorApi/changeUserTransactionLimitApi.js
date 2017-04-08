(function(){

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var changeUTLApi = function changeUTLApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    changeUTLApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.changeTransactionLimit(this.response.request.body , resHandle);
    };

    module.exports.changeUTLApi = function(rin , callback){

        var dApi = new changeUTLApi(rin , callback);
        dApi.requestApi();
    };
})();
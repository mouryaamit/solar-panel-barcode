(function(){

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var firstTimeLoginApi = function firstTimeLoginApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    firstTimeLoginApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.firstTimeLoginChange(this.response.request.body , resHandle);
    };

    module.exports.firstTimeLoginApi = function(rin , callback){
        var dApi = new firstTimeLoginApi(rin , callback);
        dApi.requestApi();
    };
})();
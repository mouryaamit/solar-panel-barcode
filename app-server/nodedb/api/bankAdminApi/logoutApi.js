(function(){

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var session = require('../../gen/sessionMethods');

    var logoutApi = function logoutApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    logoutApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var handleSession = session.SessionHandle(this.response , this.tnxId);
        handleSession.logout(resHandle);

    };

    module.exports.logoutApi = function(rin , callback){

        var dApi = new logoutApi(rin , callback);
        dApi.requestApi();
    };
})();
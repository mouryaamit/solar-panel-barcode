/**
 * Created by Amit Mourya <amourya@vsoftcorp.com> on 8/18/15.
 */
(function(){

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var updateNickNameApi = function updateNickNameApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    updateNickNameApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.updateNickName(this.response.request.body , resHandle);
    };

    module.exports.updateNickNameApi = function(rin , callback){
        var dApi = new updateNickNameApi(rin , callback);
        dApi.requestApi();
    };
})();